'use client';

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import RoomSidebar from '@/app/components/chat/RoomSidebar';
import ChatArea from '@/app/components/chat/ChatArea';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Room {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
}

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
  } | null;
}

interface FormattedMessage {
  id: string;
  user_id: string;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export default function ChatSessionPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base">Loading chat session...</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Please wait while we connect you to the chat service</p>
        </div>
      </div>
    }>
      <ChatSessionContent />
    </Suspense>
  );
}

function ChatSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, loading: authLoading } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false on mobile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [messagesLimit] = useState(50);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roomsChannelRef = useRef<RealtimeChannel | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageQueueRef = useRef<Message[]>([]);
  const isProcessingQueueRef = useRef(false);
  const lastMessageCountRef = useRef(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're in demo mode
  const isDemoMode = searchParams.get('demo') === 'true' || 
                     user?.email === "project.evaluation@unifiedmentor.com" || 
                     (typeof window !== 'undefined' && localStorage.getItem('isDemoUser') === 'true');
  
  console.log('Demo mode detection:', {
    urlParam: searchParams.get('demo') === 'true',
    userEmail: user?.email === "project.evaluation@unifiedmentor.com",
    localStorage: typeof window !== 'undefined' && localStorage.getItem('isDemoUser') === 'true',
    isDemoMode: isDemoMode
  });

  // Authentication check
  useEffect(() => {
    console.log('Authentication check:', {
      authLoading,
      session,
      user,
      isDemoMode
    });
    
    if (!authLoading && !session && !isDemoMode) {
      // Check if this is due to a refresh token error
      const urlParams = new URLSearchParams(window.location.search);
      const sessionExpired = urlParams.get('sessionExpired');
      if (sessionExpired === 'true') {
        router.push('/auth/login?sessionExpired=true');
      } else {
        router.push('/auth/login');
      }
    } else if ((session && user) || isDemoMode) {
      console.log('Initializing user');
      initializeUser();
    }
  }, [authLoading, session, user, router, isDemoMode]);

  // Initialize user data
  const initializeUser = useCallback(async () => {
    if (!session && !isDemoMode) return;
    
    try {
      // For demo users, set role to user and fetch all rooms
      if (isDemoMode) {
        console.log('Initializing demo user');
        setUserRole('user');
        await fetchRooms();
        return;
      }
      
      // Fetch user role for real users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profileError && profileData?.role) {
        setUserRole(profileData.role);
      } else {
        setUserRole('user');
      }

      // Fetch rooms
      await fetchRooms();
      
      // Restore last selected room from localStorage
      const savedRoomId = localStorage.getItem('activeRoom');
      if (savedRoomId) {
        setSelectedRoomId(savedRoomId);
      }
    } catch (err: any) {
      console.error('Error initializing user:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setUserRole('user');
      await fetchRooms();
    }
  }, [session, isDemoMode, router]);

  // Fetch rooms with optimized approach
  const fetchRooms = useCallback(async () => {
    if (!session && !isDemoMode) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      loadingTimeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 second timeout
      
      // For demo users, fetch all rooms
      if (isDemoMode) {
        console.log('Fetching rooms for demo user');
        
        // Use API endpoint to fetch all rooms for demo users
        try {
          const response = await fetch('/api/demo-rooms');
          const result = await response.json();
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          const roomsData = result.rooms;
          console.log('Rooms data for demo user:', roomsData);

          setRooms(roomsData || []);
          console.log('Set rooms for demo user:', roomsData);
          
          // If no room is selected yet, select the first one
          if (!selectedRoomId && roomsData && roomsData.length > 0) {
            const savedRoomId = localStorage.getItem('activeRoom');
            console.log('Saved room ID:', savedRoomId);
            if (savedRoomId && roomsData.some((room: Room) => room.id === savedRoomId)) {
              setSelectedRoomId(savedRoomId);
              console.log('Selected saved room ID:', savedRoomId);
            } else {
              setSelectedRoomId(roomsData[0].id);
              console.log('Selected first room ID:', roomsData[0].id);
            }
          }
        } catch (fetchError) {
          console.error('Error fetching rooms for demo user:', fetchError);
          setError('Failed to load chat rooms. Please try again or contact an administrator.');
        }
        setLoading(false);
        return;
      }

      // Try to get rooms where user is a member (real users)
      let userRooms = [];
      
      // Use room_members table (our schema)
      const { data: roomMembers, error: membersError } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', session.user.id);

      if (!membersError && roomMembers && roomMembers.length > 0) {
        const roomIds = roomMembers.map(rm => rm.room_id);
        
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .in('id', roomIds)
          .order('created_at', { ascending: true });

        if (!roomsError) {
          userRooms = roomsData || [];
        }
      } else {
        // Final fallback: get all rooms (public mode) - but only for admin users
        // For regular users, show a helpful message
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const isAdmin = !profileError && profileData?.role === 'admin';
        
        if (isAdmin) {
          // Admins can see all rooms
          const { data: roomsData, error: roomsError } = await supabase
            .from('rooms')
            .select('*')
            .order('created_at', { ascending: true });

          if (!roomsError) {
            userRooms = roomsData || [];
          }
        } else {
          // For regular users, try to add them to existing rooms
          const { data: allRooms, error: allRoomsError } = await supabase
            .from('rooms')
            .select('*')
            .order('created_at', { ascending: true });

          if (!allRoomsError && allRooms && allRooms.length > 0) {
            // Try to add user to all rooms (this will only work if RLS allows it)
            const roomIds = allRooms.map(room => room.id);
            
            // Try to insert user as member of all rooms
            const { error: insertError } = await supabase
              .from('room_members')
              .insert(roomIds.map(roomId => ({
                room_id: roomId,
                user_id: session.user.id
              })));

            // If successful or if there's no error (user might already be a member),
            // fetch the rooms again
            if (!insertError) {
              const { data: updatedRoomMembers, error: updatedMembersError } = await supabase
                .from('room_members')
                .select('room_id')
                .eq('user_id', session.user.id);

              if (!updatedMembersError && updatedRoomMembers && updatedRoomMembers.length > 0) {
                const updatedRoomIds = updatedRoomMembers.map(rm => rm.room_id);
                
                const { data: roomsData, error: roomsError } = await supabase
                  .from('rooms')
                  .select('*')
                  .in('id', updatedRoomIds)
                  .order('created_at', { ascending: true });

                if (!roomsError) {
                  userRooms = roomsData || [];
                }
              }
            } else {
              // If we can't add the user to rooms, show all rooms anyway
              // but with a note that they might not be able to join
              userRooms = allRooms || [];
            }
          }
        }
      }
      
      setRooms(userRooms);
      
      // If no room is selected yet, select the first one or restore from localStorage
      if (!selectedRoomId && userRooms.length > 0) {
        const savedRoomId = localStorage.getItem('activeRoom');
        if (savedRoomId && userRooms.some((room: Room) => room.id === savedRoomId)) {
          setSelectedRoomId(savedRoomId);
        } else {
          setSelectedRoomId(userRooms[0].id);
        }
      } else if (!selectedRoomId && userRooms.length === 0) {
        // If no rooms are available, clear any saved room
        localStorage.removeItem('activeRoom');
      }
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to load chat rooms. Please try again or contact an administrator.');
    } finally {
      setLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [session, selectedRoomId, isDemoMode, router]);

  // Update selected room and save to localStorage
  const handleRoomSelect = useCallback((roomId: string) => {
    console.log('Selecting room:', roomId);
    setSelectedRoomId(roomId);
    localStorage.setItem('activeRoom', roomId);
    
    // Close sidebar on mobile after selecting a room
    if (window.innerWidth < 768) { // md breakpoint
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Subscribe to rooms changes
  useEffect(() => {
    if (!session && !isDemoMode) return;

    // Skip for demo users
    if (isDemoMode) return;

    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          setRooms(prev => [...prev, payload.new as Room]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          setRooms(prev => prev.map(room => 
            room.id === payload.new.id ? payload.new as Room : room
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          setRooms(prev => prev.filter(room => room.id !== payload.old.id));
        }
      )
      .subscribe();

    roomsChannelRef.current = channel;

    return () => {
      if (roomsChannelRef.current) {
        supabase.removeChannel(roomsChannelRef.current);
      }
    };
  }, [session, isDemoMode]);

  // Fetch messages and subscribe to realtime updates
  useEffect(() => {
    if ((!session && !isDemoMode) || !selectedRoomId) return;

    const fetchAndSubscribe = async () => {
      // Save selected room to localStorage
      localStorage.setItem('activeRoom', selectedRoomId);
      
      // Fetch initial messages
      await fetchMessages();
      
      // Skip subscription for demo users
      if (isDemoMode) return;
      
      // Subscribe to new messages
      subscribeToMessages();
      
      // Update presence
      updateUserPresence(selectedRoomId, 'online');
    };

    fetchAndSubscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (!isDemoMode && selectedRoomId) {
        updateUserPresence(selectedRoomId, 'offline');
      }
    };
  }, [session, selectedRoomId, isDemoMode]);

  // Fetch messages with pagination and caching
  const fetchMessages = useCallback(async () => {
    if ((!session && !isDemoMode) || !selectedRoomId) return;

    // For demo users, create some simulated messages
    if (isDemoMode) {
      try {
        // Create simulated messages for demo
        const simulatedMessages: Message[] = [
          {
            id: 'demo-1',
            room_id: selectedRoomId,
            user_id: 'demo-user-1',
            content: 'Welcome to the demo! This is a simulated message.',
            created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
            profiles: {
              username: 'Demo User 1',
              display_name: 'Demo User 1'
            }
          },
          {
            id: 'demo-2',
            room_id: selectedRoomId,
            user_id: 'demo-user-2',
            content: 'You can send messages in demo mode, but they won\'t be persisted.',
            created_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
            profiles: {
              username: 'Demo User 2',
              display_name: 'Demo User 2'
            }
          },
          {
            id: 'demo-3',
            room_id: selectedRoomId,
            user_id: 'demo-user-id',
            content: 'Try sending a message to see how it works!',
            created_at: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
            profiles: {
              username: 'Demo User',
              display_name: 'Demo User'
            }
          }
        ];

        setMessages(simulatedMessages);
        setHasMoreMessages(false); // No more messages for demo
      } catch (err: any) {
        console.error('Error fetching messages for demo user:', err);
        setError('Failed to load messages. Please try again.');
      }
      return;
    }

    try {
      // Check if we have cached messages for this room
      const cachedMessages = sessionStorage.getItem(`messages_${selectedRoomId}`);
      if (cachedMessages && messagesOffset === 0) {
        const parsedMessages = JSON.parse(cachedMessages);
        setMessages(parsedMessages);
        setHasMoreMessages(parsedMessages.length === messagesLimit);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          room_id,
          user_id,
          content,
          created_at
        `)
        .eq('room_id', selectedRoomId)
        .order('created_at', { ascending: false })
        .range(messagesOffset, messagesOffset + messagesLimit - 1);

      if (error) throw error;
      
      // Fetch user profiles in batch for better performance (real users)
      const userIds = [...new Set(data.map(msg => msg.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', userIds);

      // Create profile lookup map
      const profileMap = profilesError ? {} : 
        profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

      // Map messages with profile data
      const messageData: Message[] = data.map(msg => ({
        id: msg.id,
        room_id: msg.room_id,
        user_id: msg.user_id,
        content: msg.content,
        created_at: msg.created_at,
        profiles: profileMap[msg.user_id] || null
      }));

      // Cache messages for this room (only for first page)
      if (messagesOffset === 0) {
        sessionStorage.setItem(`messages_${selectedRoomId}`, JSON.stringify(messageData.reverse()));
      }

      // Set messages (reverse for correct order)
      if (messagesOffset > 0) {
        setMessages(prev => [...messageData.reverse(), ...prev]);
      } else {
        setMessages(messageData.reverse());
      }
      
      setHasMoreMessages(data.length === messagesLimit);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to load messages. Please try again.');
    }
  }, [session, selectedRoomId, messagesOffset, messagesLimit, isDemoMode, router]);

  // Clear message cache when switching rooms
  useEffect(() => {
    if (selectedRoomId) {
      // Clear cache for previous room
      sessionStorage.removeItem(`messages_${selectedRoomId}`);
    }
  }, [selectedRoomId]);

  // Send a new message with instant feedback
  const sendMessage = useCallback(async () => {
    if ((!session && !isDemoMode) || !selectedRoomId || !newMessage.trim()) return;

    // Allow demo users to send messages (but they won't be persisted)
    if (isDemoMode) {
      try {
        setError(null);
        
        // Create temporary message for instant feedback
        const tempMessage: Message = {
          id: `temp-${Date.now()}`,
          room_id: selectedRoomId,
          user_id: 'demo-user-id',
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
          profiles: {
            username: 'Demo User',
            display_name: 'Demo User'
          }
        };

        // Add to messages immediately for instant feedback
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        // Scroll to bottom immediately
        setTimeout(() => {
          if (messagesEndRef.current && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 10);
      } catch (err: any) {
        console.error('Error sending message:', err);
        setError('Failed to send message. Please try again.');
        
        // Remove temporary message on error
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
      }
      return;
    }

    try {
      setError(null);
      
      // Create temporary message for instant feedback
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        room_id: selectedRoomId,
        user_id: session.user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        profiles: {
          username: user?.user_metadata?.username || 'You',
          display_name: user?.user_metadata?.display_name || user?.user_metadata?.username || 'You'
        }
      };

      // Add to messages immediately for instant feedback
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Scroll to bottom immediately
      setTimeout(() => {
        if (messagesEndRef.current && chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 10);

      // Send to database
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          room_id: selectedRoomId,
          user_id: session.user.id,
          content: newMessage.trim(),
        }])
        .select();

      if (error) throw error;

      // Replace temporary message with actual message
      if (data && data[0]) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? {...data[0], profiles: tempMessage.profiles} : msg
          )
        );
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to send message. Please try again.');
      
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    }
  }, [session, selectedRoomId, newMessage, user, isDemoMode, router]);

  // Optimize message rendering with React.memo
  const optimizedMessages = useMemo(() => {
    return messages.map(msg => ({
      ...msg,
      // Add a stable key for React rendering
      key: msg.id
    }));
  }, [messages]);

  // Debounce message sending to prevent spam
  const debouncedSendMessage = useMemo(() => {
    return debounce(sendMessage, 300);
  }, [sendMessage]);

  // Debounce function
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Subscribe to messages with optimized approach
  const subscribeToMessages = useCallback(() => {
    // Skip subscription for demo users
    if (isDemoMode) return;

    if (!session || !selectedRoomId) return;

    // Unsubscribe from previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to new messages
    const channel = supabase
      .channel(`room-${selectedRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${selectedRoomId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Fetch profile for the new message
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', newMessage.user_id)
            .single();

          const messageWithProfile: Message = {
            ...newMessage,
            profiles: profileError ? null : profileData
          };

          // Add to queue for smooth processing
          messageQueueRef.current.push(messageWithProfile);
          processMessageQueue();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${selectedRoomId}`,
        },
        (payload) => {
          // Handle message updates
          setMessages(prev => prev.map(msg => 
            msg.id === payload.new.id ? {...msg, ...payload.new} : msg
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${selectedRoomId}`,
        },
        (payload) => {
          // Handle message deletions
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .on(
        'broadcast',
        { event: 'typing' },
        (payload) => {
          // Handle typing indicators
          const { user, isTyping } = payload.payload;
          
          if (isTyping) {
            // Add user to typing list
            setTypingUsers(prev => {
              if (!prev.includes(user)) {
                return [...prev, user];
              }
              return prev;
            });
            
            // Clear typing status after 3 seconds
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            
            typingTimeoutRef.current = setTimeout(() => {
              setTypingUsers(prev => prev.filter(u => u !== user));
            }, 3000);
          } else {
            // Remove user from typing list
            setTypingUsers(prev => prev.filter(u => u !== user));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to room messages');
          setError('Failed to subscribe to real-time updates.');
        } else if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to room-${selectedRoomId}`);
        }
      });

    channelRef.current = channel;
  }, [session, selectedRoomId, isDemoMode]);

  // Process message queue for smooth updates
  const processMessageQueue = useCallback(() => {
    if (isProcessingQueueRef.current || messageQueueRef.current.length === 0) {
      return;
    }

    isProcessingQueueRef.current = true;

    // Process all queued messages
    const newMessages = [...messageQueueRef.current];
    messageQueueRef.current = [];

    setMessages(prev => {
      const updatedMessages = [...prev];
      
      // Add new messages
      newMessages.forEach(newMsg => {
        // Check if message already exists to prevent duplicates
        if (!updatedMessages.some(msg => msg.id === newMsg.id)) {
          updatedMessages.push(newMsg);
        }
      });

      return updatedMessages;
    });

    // Scroll to bottom after a short delay to ensure DOM update
    setTimeout(() => {
      if (messagesEndRef.current && chatContainerRef.current) {
        // Use smooth scrolling for better UX
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      isProcessingQueueRef.current = false;
    }, 50);
  }, []);

  // Scroll to bottom when messages change (only for new messages)
  useEffect(() => {
    // Only scroll automatically for new messages (when we have more messages than before)
    if (messages.length > lastMessageCountRef.current && messagesEndRef.current && chatContainerRef.current) {
      // Immediate scroll for new messages for instant feedback
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Update the last message count
    lastMessageCountRef.current = messages.length;
  }, [messages]);

  // Load more messages
  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages) {
      setMessagesOffset(prev => prev + messagesLimit);
    }
  }, [hasMoreMessages, messagesLimit]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    // Allow demo users to send typing indicators (but they won't be broadcasted)
    if (isDemoMode) {
      try {
        // Update local typing state for demo user
        if (isTyping) {
          setTypingUsers(prev => {
            if (!prev.includes('Demo User')) {
              return [...prev, 'Demo User'];
            }
            return prev;
          });
          
          // Clear typing status after 3 seconds
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u !== 'Demo User'));
          }, 3000);
        } else {
          // Remove user from typing list
          setTypingUsers(prev => prev.filter(u => u !== 'Demo User'));
        }
      } catch (err: any) {
        console.error('Error sending typing indicator:', err);
      }
      return;
    }

    if (!session || !selectedRoomId || !channelRef.current) return;

    try {
      // Get user's display name
      const displayName = user?.user_metadata?.display_name || 
                         user?.user_metadata?.username || 
                         user?.email?.split('@')[0] || 
                         'Anonymous';
      
      // Broadcast typing status
      await channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user: displayName,
          isTyping: isTyping
        }
      });
    } catch (err: any) {
      console.error('Error sending typing indicator:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
    }
  }, [session, selectedRoomId, user, isDemoMode, router]);

  // Handle input change with typing indicator
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Skip for demo users
    if (isDemoMode) return;
    
    // Send typing indicator
    if (e.target.value.trim()) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
    
    // Clear typing indicator after 1 second of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 1000);
  }, [setNewMessage, sendTypingIndicator, isDemoMode]);

  // Create a new room
  const createRoom = useCallback(async (roomName: string, roomDescription: string) => {
    // Allow demo users to create rooms (but they won't be persisted)
    if (isDemoMode) {
      try {
        setError(null);
        
        // Create a temporary room for instant feedback
        const tempRoom: Room = {
          id: `temp-${Date.now()}`,
          name: roomName,
          description: roomDescription,
          created_at: new Date().toISOString(),
          created_by: 'demo-user-id'
        };

        setRooms(prev => [...prev, tempRoom]);
        setSelectedRoomId(tempRoom.id);
        setSuccess('Room created successfully (demo mode - not persisted)');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        console.error('Error creating room:', err);
        setError('Failed to create room. Please try again.');
      }
      return;
    }

    if (!session) return;

    try {
      setError(null);
      
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name: roomName, description: roomDescription }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create room');
      }

      setRooms(prev => [...prev, result.room]);
      setSelectedRoomId(result.room.id);
      setSuccess('Room created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error creating room:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to create room. Please try again.');
    }
  }, [session, isDemoMode, router]);

  // Delete a room
  const deleteRoom = useCallback(async (roomId: string) => {
    // Allow demo users to delete rooms (but they won't be persisted)
    if (isDemoMode) {
      try {
        setError(null);
        
        setRooms(prev => prev.filter(room => room.id !== roomId));
        
        if (selectedRoomId === roomId) {
          setSelectedRoomId(rooms.length > 1 ? rooms[0].id : null);
        }
        
        setSuccess('Room deleted successfully (demo mode - not persisted)');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        console.error('Error deleting room:', err);
        setError('Failed to delete room. Please try again.');
      }
      return;
    }

    if (!session) return;

    try {
      setError(null);
      
      const response = await fetch('/api/delete-room', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ roomId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete room');
      }

      setRooms(prev => prev.filter(room => room.id !== roomId));
      
      if (selectedRoomId === roomId) {
        setSelectedRoomId(rooms.length > 1 ? rooms[0].id : null);
      }
      
      setSuccess('Room deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting room:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to delete room. Please try again.');
    }
  }, [session, selectedRoomId, rooms, isDemoMode, router]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    // Allow demo users to delete messages (but they won't be persisted)
    if (isDemoMode) {
      try {
        setError(null);
        
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setSuccess('Message deleted successfully (demo mode - not persisted)');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        console.error('Error deleting message:', err);
        setError('Failed to delete message. Please try again.');
      }
      return;
    }

    if (!session) return;

    try {
      setError(null);
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSuccess('Message deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting message:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to delete message. Please try again.');
    }
  }, [session, isDemoMode, router]);

  // Update user presence with error handling
  const updateUserPresence = useCallback(async (roomId: string, status: 'online' | 'offline') => {
    // Skip for demo users
    if (isDemoMode) return;

    if (!session) return;

    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          userId: session.user.id,
          status
        }),
      });
    } catch (err: any) {
      console.error('Error updating presence:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      // Silently ignore presence errors to prevent UI disruption
    }
  }, [session, isDemoMode, router]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    // Handle logout for demo users
    if (isDemoMode) {
      try {
        setError(null);
        
        // Clean up demo flag
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isDemoUser');
        }
        
        setSuccess('Logged out successfully');
        setTimeout(() => router.push('/auth/login'), 500);
      } catch (err: any) {
        console.error('Error signing out demo user:', err);
        setError('Failed to sign out. Please try again.');
      }
      return;
    }

    try {
      setError(null);
      
      // Clean up channels
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      if (roomsChannelRef.current) {
        supabase.removeChannel(roomsChannelRef.current);
      }
      
      // Update presence
      if (selectedRoomId && !isDemoMode) {
        updateUserPresence(selectedRoomId, 'offline');
      }
      
      // Sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setSuccess('Logged out successfully');
      setTimeout(() => router.push('/auth/login'), 500);
    } catch (err: any) {
      console.error('Error signing out:', err);
      // Handle refresh token errors specifically
      if (err.message && err.message.includes('Refresh Token')) {
        router.push('/auth/login?sessionExpired=true');
        return;
      }
      setError('Failed to sign out. Please try again.');
    }
  }, [selectedRoomId, router, isDemoMode]);

  // Convert messages to the format expected by ChatArea
  const formattedMessages: FormattedMessage[] = messages.map((msg) => ({
    id: msg.id,
    user_id: msg.user_id,
    user: msg.profiles?.display_name || msg.profiles?.username || 'Unknown User',
    text: msg.content,
    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    self: msg.user_id === session?.user.id,
    isAI: false,
  }));

  // Add message function for ChatArea
  const addMessage = useCallback((message: FormattedMessage) => {
    if (message.self) {
      setNewMessage(message.text);
      sendMessage();
    }
  }, [sendMessage]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Loading state - with timeout to prevent infinite loading
  if (authLoading || loading) {
    return (
      <div 
        ref={pageRef}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base">Loading chat session...</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Please wait while we connect you to the chat service</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        ref={pageRef}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="text-center p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700 max-w-xs sm:max-w-md">
          <div className="text-red-400 text-xl sm:text-2xl mb-2">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300 mb-4 text-xs sm:text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No rooms state
  if (rooms.length === 0 && !loading) {
    console.log('No rooms state:', {
      roomsLength: rooms.length,
      loading,
      isDemoMode
    });
    
    return (
      <div 
        ref={pageRef}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="text-center p-4 sm:p-6 bg-gray-800/50 rounded-xl border border-gray-700 max-w-xs sm:max-w-md">
          <div className="text-cyan-400 text-xl sm:text-2xl mb-2">💬</div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">No Chat Rooms Available</h2>
          <p className="text-gray-300 mb-4 text-xs sm:text-sm">
            {error || 'It looks like there are no chat rooms available for you yet.'}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Contact an administrator to be added to existing rooms or check back later.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={pageRef}
      className="h-screen w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden flex flex-col"
    >
      {/* Demo user banner */}
      {isDemoMode && (
        <div className="bg-yellow-900/50 border-b border-yellow-700/50 p-2 text-center">
          <p className="text-yellow-200 text-sm">
            <span className="font-bold">Demo Mode:</span> You are using a demo account with full functionality. 
            All actions are simulated and will not be persisted. <a href="/auth/login" className="text-yellow-300 underline">Sign up for a real account</a> for persistent access.
          </p>
        </div>
      )}
      
      {/* Success notification */}
      {success && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg animate-fadeIn text-xs sm:text-sm">
          {success}
        </div>
      )}
      
      {/* Error notification */}
      {error && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg animate-fadeIn text-xs sm:text-sm">
          {error}
        </div>
      )}
      
      {/* Main content area - flex column for mobile, flex row for desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden by default on mobile, shown on desktop */}
        <aside 
          ref={sidebarRef}
          className={`absolute md:relative z-30 md:z-0 w-64 md:w-80 h-full bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 flex-shrink-0`}
        >
          <RoomSidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            sessionId={session?.user?.id || user?.id || 'guest'}
            userRole={userRole}
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            createRoom={createRoom}
            deleteRoom={deleteRoom}
          />
        </aside>
        
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Main Chat Area - Takes full width on mobile, expands on desktop */}
        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          {selectedRoomId ? (
            <ChatArea 
              messages={formattedMessages}
              addMessage={addMessage}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
              handleLogout={handleLogout}
              userRole={userRole}
              deleteMessage={deleteMessage}
              loadMoreMessages={loadMoreMessages}
              hasMoreMessages={hasMoreMessages}
              isTyping={isTyping}
              typingUsers={typingUsers}
              handleInputChange={handleInputChange}
              // Add new props for room selection
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={handleRoomSelect}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 p-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-2">👋</div>
                <p className="text-base sm:text-lg">Select a room to start chatting</p>
                <p className="text-xs sm:text-sm mt-2">or create a new room</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
