'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Authentication check
  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/auth/login');
    } else if (session && user) {
      initializeUser();
    }
  }, [authLoading, session, user, router]);

  // Initialize user data
  const initializeUser = useCallback(async () => {
    if (!session) return;
    
    try {
      // Fetch user role
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
    } catch (err) {
      console.error('Error initializing user:', err);
      setUserRole('user');
      await fetchRooms();
    }
  }, [session]);

  // Fetch rooms with optimized approach
  const fetchRooms = useCallback(async () => {
    if (!session) {
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
      
      // Try to get rooms where user is a member
      let userRooms = [];
      
      // First try the user_rooms table (new schema)
      const { data: userRoomsData, error: userRoomsError } = await supabase
        .from('user_rooms')
        .select('room_id')
        .eq('user_id', session.user.id);

      if (!userRoomsError && userRoomsData && userRoomsData.length > 0) {
        const roomIds = userRoomsData.map(ur => ur.room_id);
        
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .in('id', roomIds)
          .order('created_at', { ascending: true });

        if (!roomsError) {
          userRooms = roomsData || [];
        }
      } else {
        // Fallback to room_members table (older schema)
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
          // Final fallback: get all rooms (public mode)
          const { data: roomsData, error: roomsError } = await supabase
            .from('rooms')
            .select('*')
            .order('created_at', { ascending: true });

          if (!roomsError) {
            userRooms = roomsData || [];
          }
        }
      }
      
      setRooms(userRooms);
      if (userRooms.length > 0 && !selectedRoomId) {
        setSelectedRoomId(userRooms[0].id);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [session, selectedRoomId]);

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
    if (!session) return;

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
  }, [session]);

  // Fetch messages and subscribe to realtime updates
  useEffect(() => {
    if (!session || !selectedRoomId) return;

    const fetchAndSubscribe = async () => {
      // Fetch initial messages
      await fetchMessages();
      
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
      updateUserPresence(selectedRoomId, 'offline');
    };
  }, [session, selectedRoomId]);

  // Fetch messages with optimized approach
  const fetchMessages = useCallback(async () => {
    if (!session || !selectedRoomId) return;

    try {
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
      
      // Fetch user profiles in batch for better performance
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

      // Set messages (reverse for correct order)
      if (messagesOffset > 0) {
        setMessages(prev => [...messageData.reverse(), ...prev]);
      } else {
        setMessages(messageData.reverse());
      }
      
      setHasMoreMessages(data.length === messagesLimit);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    }
  }, [session, selectedRoomId, messagesOffset, messagesLimit]);

  // Subscribe to messages with optimized approach
  const subscribeToMessages = useCallback(() => {
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
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to room messages');
          setError('Failed to subscribe to real-time updates.');
        }
      });

    channelRef.current = channel;
  }, [session, selectedRoomId]);

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

  // Send a new message with instant feedback
  const sendMessage = useCallback(async () => {
    if (!session || !selectedRoomId || !newMessage.trim()) return;

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
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    }
  }, [session, selectedRoomId, newMessage, user]);

  // Create a new room
  const createRoom = useCallback(async (roomName: string, roomDescription: string) => {
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
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please try again.');
    }
  }, [session]);

  // Delete a room
  const deleteRoom = useCallback(async (roomId: string) => {
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
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room. Please try again.');
    }
  }, [session, selectedRoomId, rooms]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
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
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message. Please try again.');
    }
  }, [session]);

  // Update user presence with error handling
  const updateUserPresence = useCallback(async (roomId: string, status: 'online' | 'offline') => {
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
    } catch (err) {
      // Silently ignore presence errors to prevent UI disruption
    }
  }, [session]);

  // Handle logout
  const handleLogout = useCallback(async () => {
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
      if (selectedRoomId) {
        updateUserPresence(selectedRoomId, 'offline');
      }
      
      // Sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setSuccess('Logged out successfully');
      setTimeout(() => router.push('/auth/login'), 500);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  }, [selectedRoomId, router]);

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
        className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading chat session...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we connect you to the chat service</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        ref={pageRef}
        className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700 max-w-md">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300 mb-4 text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={pageRef}
      className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden"
    >
      {/* Success notification */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          {success}
        </div>
      )}
      
      {/* Error notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          {error}
        </div>
      )}
      
      {/* Grid-based responsive layout */}
      <div className="grid grid-cols-12 h-full">
        {/* Sidebar - Desktop: 25% (col-span-3), Tablet/Mobile: hidden by default */}
        <aside 
          ref={sidebarRef}
          className={`hidden lg:block lg:col-span-3 bg-gradient-to-b from-slate-900 to-slate-800 h-full ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-20 absolute lg:relative`}
        >
          <RoomSidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            sessionId={session?.user.id || 'guest'}
            userRole={userRole}
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            createRoom={createRoom}
            deleteRoom={deleteRoom}
          />
        </aside>
        
        {/* Main Chat Area - Desktop: 75% (col-span-9), Tablet: 100% (col-span-12), Mobile: 100% (col-span-12) */}
        <main className="col-span-12 lg:col-span-9 bg-slate-950 h-full flex flex-col relative">
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
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">👋</div>
                <p className="text-lg">Select a room to start chatting</p>
                <p className="text-sm mt-2">or create a new room</p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Floating button for mobile/tablet */}
      <div className="fixed bottom-6 left-6 z-30">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden w-14 h-14 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg flex items-center justify-center"
        >
          <span className="text-xl">_rooms</span>
        </button>
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
}