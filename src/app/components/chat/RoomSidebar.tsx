'use client';

import { useState } from 'react';


interface Room {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
  unread?: number;
}

interface RoomSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sessionId: string;
  rooms?: Room[];
  selectedRoomId?: string | null;
  setSelectedRoomId?: (id: string) => void;
  createRoom?: (name: string) => void;
}

export default function RoomSidebar({
  sidebarOpen,
  setSidebarOpen,
  sessionId,
  rooms = [],
  selectedRoomId = null,
  setSelectedRoomId = () => {},
  createRoom = () => {}
}: RoomSidebarProps) {
  const [newRoomName, setNewRoomName] = useState('');
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom(newRoomName.trim());
      setNewRoomName('');
      setShowNewRoomInput(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    
    // Close sidebar on mobile after selecting a room
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Chat Rooms</h2>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4 sm:mb-6">
          <div className="text-xs text-gray-400 mb-2 session-id">SESSION ID</div>
          <div className="text-xs sm:text-sm font-mono bg-gray-700/50 p-2 rounded-lg text-cyan-300 session-id break-words">
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
          {rooms.map((room) => (
            <div 
              key={room.id}
              onClick={() => handleJoinRoom(room.id)}
              className={`flex items-center p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                room.id === selectedRoomId
                  ? 'bg-gradient-to-r from-cyan-700 to-blue-700 glow-cyan' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 ${room.id === selectedRoomId ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <span className="flex-1 text-sm sm:text-base truncate">{room.name}</span>
              {room.unread && room.unread > 0 && (
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