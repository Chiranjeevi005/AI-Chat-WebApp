'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getSocket } from '@/utils/socket';

interface Room {
  name: string;
  unread: number;
  active: boolean;
  isAI: boolean;
}

export default function RoomSidebar({ 
  sidebarOpen, 
  setSidebarOpen,
  sessionId
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void;
  sessionId: string;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'General', unread: 0, active: true, isAI: false },
    { name: 'Design Team', unread: 3, active: false, isAI: false },
    { name: 'Marketing', unread: 0, active: false, isAI: false },
    { name: 'Development', unread: 1, active: false, isAI: false },
    { name: 'AI Room 🧠', unread: 5, active: false, isAI: true },
  ]);
  const [newRoomName, setNewRoomName] = useState('');
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        gsap.fromTo(
          sidebarRef.current,
          { x: sidebarOpen ? 0 : -300 },
          { x: 0, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        gsap.to(sidebarRef.current, {
          x: -300,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => setSidebarOpen(false)
        });
      }
    }
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    // Listen for room updates from server
    socket.on('roomsUpdate', (updatedRooms: string[]) => {
      setRooms(prevRooms => {
        // Update existing rooms or add new ones
        const updatedRoomList = updatedRooms.map(roomName => {
          const existingRoom = prevRooms.find(r => r.name === roomName);
          return existingRoom || {
            name: roomName,
            unread: 0,
            active: false,
            isAI: roomName.includes('AI') || roomName.includes('🧠')
          };
        });
        
        // Mark the first room as active if none is active
        if (!updatedRoomList.some(r => r.active)) {
          updatedRoomList[0].active = true;
        }
        
        return updatedRoomList;
      });
    });

    return () => {
      socket.off('roomsUpdate');
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      socket.emit('createRoom', newRoomName.trim());
      setNewRoomName('');
      setShowNewRoomInput(false);
    }
  };

  const handleJoinRoom = (roomName: string) => {
    // In a real implementation, this would emit a join event
    // For now, we'll just update the active state
    setRooms(prevRooms => 
      prevRooms.map(room => ({
        ...room,
        active: room.name === roomName
      }))
    );
    
    // Close sidebar on mobile after selecting a room
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`absolute md:relative z-30 w-64 bg-gray-800 bg-opacity-50 glass h-full transition-all duration-300 sidebar-container border-r border-gray-700 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Chat Rooms</h2>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4 sm:mb-6">
          <div className="text-xs text-gray-400 mb-2 session-id">SESSION ID</div>
          <div className="text-xs sm:text-sm font-mono bg-gray-700/50 p-2 rounded-lg text-cyan-300 session-id">
            {sessionId}
          </div>
        </div>
        
        {!showNewRoomInput ? (
          <button 
            onClick={() => setShowNewRoomInput(true)}
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl mb-4 flex items-center justify-center glow-cyan text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Room
          </button>
        ) : (
          <div className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
                className="flex-1 bg-gray-700 text-white rounded-l-xl px-2 py-1 sm:px-3 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
              <button
                onClick={handleCreateRoom}
                className="bg-cyan-600 text-white px-2 sm:px-3 rounded-r-xl hover:bg-cyan-700 text-sm"
              >
                Create
              </button>
            </div>
            <button
              onClick={() => setShowNewRoomInput(false)}
              className="mt-2 text-gray-400 text-xs sm:text-sm hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
          {rooms.map((room, index) => (
            <div 
              key={index}
              onClick={() => handleJoinRoom(room.name)}
              className={`flex items-center p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                room.active 
                  ? 'bg-gradient-to-r from-cyan-700 to-blue-700 glow-cyan' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 ${room.active ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <span className="flex-1 text-sm sm:text-base truncate">{room.name}</span>
              {room.isAI && (
                <span className="ml-1 sm:ml-2 text-xs bg-gradient-to-r from-purple-500 to-violet-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  AI
                </span>
              )}
              {room.unread > 0 && (
                <span className="bg-cyan-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {room.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}