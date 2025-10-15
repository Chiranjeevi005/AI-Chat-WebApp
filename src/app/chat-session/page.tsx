'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import RoomSidebar from '@/app/components/chat/RoomSidebar';
import ChatArea from '@/app/components/chat/ChatArea';
import { RealtimeChannel } from '@supabase/supabase-js';
import { gsap } from 'gsap';

interface Room {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

interface Message {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
  };
}

interface FormattedMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI: boolean;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roomsChannelRef = useRef<RealtimeChannel | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Authentication check
  useEffect(() => {
    console.log('Auth check - loading:', authLoading, 'session:', session);
    if (!authLoading) {
      if (!session) {
        console.log('No session found, redirecting to login');
        router.push('/auth/login');
      } else {
        console.log('User authenticated:', user?.id);
      }
    }
  }, [authLoading, session, user, router]);

  // Fetch rooms
  useEffect(() => {
    if (!session) return;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        setRooms(data || []);
        if (data && data.length > 0 && !selectedRoomId) {
          setSelectedRoomId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [session, selectedRoomId]);

  // Subscribe to rooms changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRooms((prev) => [...prev, payload.new as Room]);
          } else if (payload.eventType === 'DELETE') {
            setRooms((prev) => prev.filter((room) => room.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setRooms((prev) =>
              prev.map((room) => (room.id === payload.new.id ? (payload.new as Room) : room))
            );
          }
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

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, profiles(username, display_name)')
          .eq('room_id', selectedRoomId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      }
    };

    // Unsubscribe from previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to messages
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
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    channelRef.current = channel;

    fetchMessages();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [session, selectedRoomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Animate sidebar on open/close
  useEffect(() => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        gsap.to(sidebarRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(sidebarRef.current, {
          x: '-100%',
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }
    }
  }, [sidebarOpen]);

  // Create a new room
  const createRoom = async (roomName: string) => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            name: roomName,
            created_by: session.user.id,
          },
        ])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        setRooms((prev) => [...prev, data[0]]);
        setSelectedRoomId(data[0].id);
      }
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room');
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!session || !selectedRoomId || !newMessage.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert([
        {
          room_id: selectedRoomId,
          sender_id: session.user.id,
          content: newMessage.trim(),
        },
      ]);

      if (error) throw error;
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Unsubscribe from all channels
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      if (roomsChannelRef.current) {
        supabase.removeChannel(roomsChannelRef.current);
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Unsubscribe from all channels when component unmounts
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      if (roomsChannelRef.current) {
        supabase.removeChannel(roomsChannelRef.current);
      }
    };
  }, []);

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading chat session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
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

  // Convert messages to the format expected by ChatArea
  const formattedMessages: FormattedMessage[] = messages.map((msg) => ({
    id: msg.id,
    user: msg.profiles?.display_name || msg.profiles?.username || 'Anonymous',
    text: msg.content,
    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    self: msg.sender_id === session?.user.id,
    isAI: false,
  }));

  // Add message function for ChatArea
  const addMessage = (message: FormattedMessage) => {
    // For user messages, send to Supabase
    if (message.self) {
      setNewMessage(message.text);
      sendMessage();
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
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
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            createRoom={createRoom}
          />
        </aside>
        
        {/* Main Chat Area - Desktop: 75% (col-span-9), Tablet: 100% (col-span-12), Mobile: 100% (col-span-12) */}
        <main className="col-span-12 lg:col-span-9 bg-slate-950 h-full flex flex-col relative">
          <ChatArea 
            messages={formattedMessages}
            addMessage={addMessage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            handleLogout={handleLogout}
          />
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