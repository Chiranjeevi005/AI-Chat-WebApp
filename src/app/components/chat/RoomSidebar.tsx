'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Room {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
  unread?: number;
}

interface RoomSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sessionId: string;
  userRole: string;
  rooms?: Room[];
  selectedRoomId?: string | null;
  setSelectedRoomId?: (id: string) => void;
  createRoom?: (name: string, description: string) => void;
  deleteRoom?: (roomId: string) => void;
}

export default function RoomSidebar({
  sidebarOpen,
  setSidebarOpen,
  sessionId,
  userRole,
  rooms = [],
  selectedRoomId = null,
  setSelectedRoomId = () => {},
  createRoom = () => {},
  deleteRoom = () => {}
}: RoomSidebarProps) {
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [schemaStatus, setSchemaStatus] = useState<'checking' | 'complete' | 'partial'>('checking');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom(newRoomName.trim(), newRoomDescription.trim());
      setNewRoomName('');
      setNewRoomDescription('');
      setShowNewRoomInput(false);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoom(roomId);
    setRoomToDelete(null);
  };

  const handleJoinRoom = (roomId: string) => {
    // Use the parent's setSelectedRoomId function which handles localStorage
    setSelectedRoomId(roomId);
    
    // Close sidebar on mobile after selecting a room
    if (window.innerWidth < 768) { // md breakpoint
      setSidebarOpen(false);
    }
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 w-full">
      {/* Header with room count */}
      <div className="p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Chat Rooms</h2>
            <p className="text-xs text-gray-400">{rooms.length} rooms available</p>
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Schema status indicator */}
        {schemaStatus === 'partial' && (
          <div className="mt-2 text-xs text-amber-400 bg-amber-900/30 p-1 rounded">
            Limited mode - All rooms visible
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
        {/* Search input */}
        <div className="mb-3 sm:mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search rooms..."
              className="w-full bg-gray-700 text-white rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4">
          <div className="text-xs text-gray-400 mb-1 sm:mb-2 session-id">SESSION ID</div>
          <div className="text-xs font-mono bg-gray-700/50 p-2 rounded-lg text-cyan-300 session-id break-words">
            {sessionId}
          </div>
        </div>
        
        {!showNewRoomInput ? (
          <button 
            onClick={() => setShowNewRoomInput(true)}
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center glow-cyan text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Room
          </button>
        ) : (
          <div className="mb-3 sm:mb-4">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name"
              className="w-full bg-gray-700 text-white rounded-lg sm:rounded-xl px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            <textarea
              value={newRoomDescription}
              onChange={(e) => setNewRoomDescription(e.target.value)}
              placeholder="Room description (optional)"
              className="w-full bg-gray-700 text-white rounded-lg sm:rounded-xl px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateRoom}
                className="flex-1 bg-cyan-600 text-white px-3 py-2 rounded-lg sm:rounded-xl hover:bg-cyan-700 text-sm"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewRoomInput(false);
                  setNewRoomName('');
                  setNewRoomDescription('');
                }}
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg sm:rounded-xl hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Room list with scrollable area */}
        <div className="space-y-1 sm:space-y-2 mt-3 sm:mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div 
                key={room.id}
                onClick={() => handleJoinRoom(room.id)}
                className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 relative ${
                  room.id === selectedRoomId
                    ? 'bg-gradient-to-r from-cyan-700 to-blue-700 glow-cyan' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 ${room.id === selectedRoomId ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate font-medium">{room.name}</div>
                  {room.description && (
                    <div className="text-xs text-gray-400 truncate">{room.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {onlineUsers[room.id] && (
                    <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">
                      {onlineUsers[room.id]}
                    </span>
                  )}
                  {(userRole === 'admin' || room.created_by === sessionId) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomToDelete(room.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No rooms found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Delete Room</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4">
              Are you sure you want to delete this room? This action cannot be undone and all messages will be lost.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDeleteRoom(roomToDelete)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg sm:rounded-xl hover:bg-red-700 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setRoomToDelete(null)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg sm:rounded-xl hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}