'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/utils/socket';
import RoomSidebar from '@/app/components/RoomSidebar';
import ChatArea from '@/app/components/ChatArea';
import AIAssistantPanel from '@/app/components/AIAssistantPanel';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';

interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI?: boolean;
}

interface AIState {
  listening: boolean;
  analyzing: boolean;
  context: string;
  participants: string[];
}

interface RoomData {
  room: string;
  users: string[];
  messages: Message[];
}

interface UserData {
  username: string;
}

export default function ChatSessionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState<string[]>(['General']);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiState, setAiState] = useState<AIState>({
    listening: false,
    analyzing: false,
    context: 'Product brainstorming',
    participants: ['You', 'AI Assistant']
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const socket = getSocket();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Simulate loading AI environment
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set username from user data
      if (user) {
        setUsername(user.email || 'User');
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    // Listen for room updates
    socket.on('roomsUpdate', (updatedRooms: string[]) => {
      setRooms(updatedRooms);
    });

    // Clean up socket listeners
    return () => {
      socket.off('roomsUpdate');
    };
  }, [socket]);

  useEffect(() => {
    if (!user) return;
    
    // Join the room when user is available
    const defaultRoom = 'General';
    setRoom(defaultRoom);
    socket.emit('join', { username: user.email || 'User', room: defaultRoom });

    // Listen for room data
    socket.on('roomData', (data: RoomData) => {
      setMessages(data.messages);
      setAiState(prev => ({
        ...prev,
        participants: data.users
      }));
    });

    // Listen for new messages
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, { ...message, self: message.user === (user.email || 'User') }]);
    });

    // Listen for user joined
    socket.on('userJoined', (data: UserData) => {
      setAiState(prev => ({
        ...prev,
        participants: [...prev.participants, data.username]
      }));
    });

    // Listen for user left
    socket.on('userLeft', (data: UserData) => {
      setAiState(prev => ({
        ...prev,
        participants: prev.participants.filter(p => p !== data.username)
      }));
    });

    // Clean up socket listeners
    return () => {
      socket.off('roomData');
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [user, socket]);

  const addMessage = (message: Message) => {
    // For user messages, send to server
    if (message.self && !message.isAI) {
      socket.emit('sendMessage', { room, message: message.text });
    }
    // For AI messages, just add to local state
    setMessages(prev => [...prev, message]);
  };

  const updateAI = (newState: Partial<AIState>) => {
    setAiState(prev => ({ ...prev, ...newState }));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30">
                <Image 
                  src="/assets/logo.png" 
                  alt="AI Chat Logo" 
                  width={80} 
                  height={80} 
                  className="rounded-full"
                />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-500/10 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing AI Environment</h2>
          <p className="text-gray-400">Preparing your intelligent chat experience...</p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex">
      {/* Room Sidebar */}
      <RoomSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        sessionId={`session-${Date.now()}`} // Temporary sessionId for compatibility
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex">
        <ChatArea 
          messages={messages}
          addMessage={addMessage}
          aiState={aiState}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* AI Assistant Panel */}
        <div className="w-96 border-l border-gray-700">
          <AIAssistantPanel 
            messages={messages}
            aiState={aiState}
            updateAI={updateAI}
          />
        </div>
      </div>
    </div>
  );
}