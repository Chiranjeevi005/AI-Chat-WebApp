'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/utils/socket';
import { gsap } from 'gsap';
import RoomSidebar from '@/app/components/RoomSidebar';
import ChatArea from '@/app/components/ChatArea';
import AIAssistantPanel from '@/app/components/AIAssistantPanel';
import Image from 'next/image';

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
  // Removed authentication context
  const [username, setUsername] = useState('Guest');
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
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showRoomSelector, setShowRoomSelector] = useState(true);
  const [roomSelectorParticles, setRoomSelectorParticles] = useState<Array<{id: number, style: React.CSSProperties}>>([]);
  const [mainInterfaceParticles, setMainInterfaceParticles] = useState<Array<{id: number, style: React.CSSProperties}>>([]);
  const socket = getSocket();

  // Generate all particles once on component mount
  useEffect(() => {
    // Set default username for guest user
    setUsername('Guest');
    
    // Room selector particles
    const rsParticles = [];
    for (let i = 0; i < 20; i++) {
      rsParticles.push({
        id: i,
        style: {
          width: `${Math.random() * 15 + 3}px`,
          height: `${Math.random() * 15 + 3}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          backgroundColor: i % 3 === 0 ? 'rgba(0, 255, 255, 0.1)' : i % 3 === 1 ? 'rgba(130, 67, 204, 0.1)' : 'rgba(255, 122, 0, 0.1)',
          animationDuration: `${Math.random() * 4 + 2}s`,
          animationDelay: `${Math.random() * 3}s`
        }
      });
    }
    setRoomSelectorParticles(rsParticles);

    // Main interface particles
    const miParticles = [];
    for (let i = 0; i < 15; i++) {
      miParticles.push({
        id: i,
        style: {
          width: `${Math.random() * 10 + 2}px`,
          height: `${Math.random() * 10 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          backgroundColor: i % 3 === 0 ? 'rgba(0, 255, 255, 0.05)' : i % 3 === 1 ? 'rgba(130, 67, 204, 0.05)' : 'rgba(255, 122, 0, 0.05)',
          animationDuration: `${Math.random() * 5 + 3}s`,
          animationDelay: `${Math.random() * 2}s`
        }
      });
    }
    setMainInterfaceParticles(miParticles);
    
    // Add cinematic entrance animation for room selector
    setTimeout(() => {
      const roomSelector = document.querySelector('.room-selector-container');
      if (roomSelector) {
        // Use GSAP to animate the room selector entrance
        gsap.fromTo(roomSelector,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)'
          }
        );
      }
    }, 100);
  }, []);

  // Removed authentication redirect effect

  // Simplified session check
  useEffect(() => {
    // Set default username for guest user
    setUsername('Guest');
    console.log('Chat session ready for guest user');
  }, []);

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
    // Join the selected room when user and room are available
    if (selectedRoom) {
      setRoom(selectedRoom);
      socket.emit('join', { username, room: selectedRoom });

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
        setMessages(prev => [...prev, { ...message, self: message.user === username }]);
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
    }
  }, [username, selectedRoom, socket]);

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

  const handleRoomSelect = (selectedRoom: string) => {
    setSelectedRoom(selectedRoom);
    setShowRoomSelector(false);
  };

  // Add entrance animation when component mounts
  useEffect(() => {
    // Create a more dramatic entrance after the blackout
    const createEntranceAnimation = () => {
      // Get the page container
      const pageContainer = document.querySelector('.chat-session-container');
      
      // Add blackout removal effect
      const blackoutRemoval = document.createElement('div');
      blackoutRemoval.id = 'blackout-removal';
      blackoutRemoval.className = 'fixed inset-0 z-[999] bg-black pointer-events-none';
      blackoutRemoval.style.opacity = '1';
      document.body.appendChild(blackoutRemoval);
      
      // Check if gsap is available and properly initialized before using it
      try {
        if (typeof gsap !== 'undefined' && gsap.to) {
          // Animate the blackout removal with a cinematic effect
          gsap.to(blackoutRemoval, {
            duration: 1.5,
            keyframes: [
              { opacity: 1, scale: 1 },
              { opacity: 0.7, scale: 1.1, ease: 'power2.out' },
              { opacity: 0.3, scale: 1.3, ease: 'power1.out' },
              { opacity: 0, scale: 1.5, ease: 'power3.in' }
            ],
            onComplete: () => {
              blackoutRemoval.remove();
            }
          });
        } else {
          // Fallback: remove blackout immediately if gsap is not available
          console.warn('GSAP not available, using fallback animation');
          setTimeout(() => {
            blackoutRemoval.remove();
          }, 1500);
        }
      } catch (error) {
        // Handle any errors with GSAP usage
        console.error('Error with GSAP animation:', error);
        // Fallback: remove blackout immediately if gsap fails
        setTimeout(() => {
          blackoutRemoval.remove();
        }, 1500);
      }
      
      // Delay the page entrance slightly to sync with blackout removal
      setTimeout(() => {
        if (pageContainer) {
          // Use GSAP to animate the page entrance instead of CSS classes
          gsap.fromTo(pageContainer,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1,
              ease: 'power2.out',
              onComplete: () => {
                pageContainer.classList.add('transition-all', 'duration-1000', 'ease-out');
                
                // Add staggered entrance animation for components with more dramatic effect
                const sidebar = document.querySelector('.sidebar-container');
                const chatArea = document.querySelector('.chat-area');
                const aiPanel = document.querySelector('.ai-panel');
                
                // Sidebar animation with bounce effect
                if (sidebar) {
                  gsap.fromTo(sidebar,
                    { x: -50, opacity: 0, scale: 0.9 },
                    {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      duration: 0.8,
                      ease: 'back.out(1.2)',
                      delay: 0.1
                    }
                  );
                }
                
                // Chat area animation with slight delay and bounce
                if (chatArea) {
                  gsap.fromTo(chatArea,
                    { y: 40, opacity: 0, scale: 0.95 },
                    {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      duration: 0.8,
                      ease: 'back.out(1.2)',
                      delay: 0.2
                    }
                  );
                }
                
                // AI panel animation with later entrance
                if (aiPanel) {
                  gsap.fromTo(aiPanel,
                    { x: 50, opacity: 0, scale: 0.9 },
                    {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      duration: 0.8,
                      ease: 'back.out(1.2)',
                      delay: 0.3
                    }
                  );
                }
                
                // Add a subtle background fade-in effect with particle animation
                const backgroundElements = document.querySelectorAll('.background-element');
                backgroundElements.forEach((el, index) => {
                  gsap.fromTo(el,
                    { opacity: 0 },
                    {
                      opacity: 1,
                      duration: 1.2,
                      ease: 'power2.out',
                      delay: 0.1 + index * 0.03
                    }
                  );
                });
                
                // Add a final subtle pulse to the entire interface
                setTimeout(() => {
                  if (pageContainer) {
                    pageContainer.classList.add('animate-pulse-once');
                    setTimeout(() => {
                      pageContainer.classList.remove('animate-pulse-once');
                    }, 300);
                  }
                }, 1200);
              }
            }
          );
        }
      }, 200);
    };
    
    // Execute the entrance animation
    createEntranceAnimation();
  }, []);

  // Show room selector if no room is selected
  if (showRoomSelector) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden relative chat-session-container opacity-0">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {roomSelectorParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-pulse background-element"
              style={particle.style}
            ></div>
          ))}
        </div>
        
        <div className="w-full max-w-md p-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl relative z-10 room-selector-container">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30 mx-auto">
                  <Image 
                    src="/assets/logo.png" 
                    alt="AI Chat Logo" 
                    width={80} 
                    height={80} 
                    className="rounded-full"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping opacity-75"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-gray-400">Select a room to start chatting</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Choose a Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select a room...</option>
                {rooms.map((roomName, index) => (
                  <option key={index} value={roomName}>
                    {roomName}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                if (selectedRoom) {
                  // Add animation before joining room
                  const button = document.querySelector('.join-room-button');
                  if (button) {
                    button.classList.add('animate-pulse');
                    setTimeout(() => {
                      button.classList.remove('animate-pulse');
                      handleRoomSelect(selectedRoom);
                    }, 300);
                  } else {
                    handleRoomSelect(selectedRoom);
                  }
                }
              }}
              disabled={!selectedRoom}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-300 join-room-button ${
                selectedRoom
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transform hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Join Room
            </button>
            
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  const newRoomName = prompt('Enter new room name:');
                  if (newRoomName) {
                    socket.emit('createRoom', newRoomName.trim());
                  }
                }}
                className="w-full py-2.5 text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all duration-300 hover:underline"
              >
                + Create New Room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex overflow-hidden relative chat-session-container opacity-0">
      {/* Animated background particles for main interface */}
      <div className="absolute inset-0">
        {mainInterfaceParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-pulse background-element"
            style={particle.style}
          ></div>
        ))}
      </div>
      
      {/* Room Sidebar */}
      <RoomSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        sessionId={`session-${Date.now()}`} // Temporary sessionId for compatibility
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex relative z-10">
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