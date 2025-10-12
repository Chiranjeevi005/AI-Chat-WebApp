'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/utils/socket';

interface LoginModalProps {
  onLogin: (username: string, room: string) => void;
  rooms: string[];
}

export default function LoginModal({ onLogin, rooms }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(rooms.length > 0 ? rooms[0] : 'General');
  const [newRoom, setNewRoom] = useState('');
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);
  const [error, setError] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    // Listen for username taken event
    socket.on('usernameTaken', (username) => {
      setError(`Username "${username}" is already taken in this room`);
    });

    // Listen for room created event
    socket.on('roomCreated', (roomName) => {
      setIsCreatingRoom(false);
      setRoom(roomName);
      setShowNewRoomInput(false);
      setNewRoom('');
    });

    // Listen for room exists event
    socket.on('roomExists', (roomName) => {
      setError(`Room "${roomName}" already exists`);
      setIsCreatingRoom(false);
    });

    return () => {
      socket.off('usernameTaken');
      socket.off('roomCreated');
      socket.off('roomExists');
    };
  }, [socket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (showNewRoomInput && !newRoom.trim()) {
      setError('Please enter a room name');
      return;
    }

    const targetRoom = showNewRoomInput ? newRoom : room;

    if (showNewRoomInput) {
      // Create new room
      setIsCreatingRoom(true);
      socket.emit('createRoom', targetRoom);
      
      // After room is created, we'll join it
      const handleRoomCreated = (roomName: string) => {
        if (roomName === targetRoom) {
          onLogin(username, targetRoom);
          socket.off('roomCreated', handleRoomCreated);
        }
      };
      
      socket.on('roomCreated', handleRoomCreated);
    } else {
      // Join existing room
      onLogin(username, targetRoom);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 glass rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Join Chat Room</h2>
          <p className="text-gray-400">Enter your username and select a room to start chatting</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
              placeholder="Enter your username"
              autoComplete="off"
            />
          </div>

          {!showNewRoomInput ? (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300 text-sm font-medium" htmlFor="room">
                  Select Room
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewRoomInput(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Create New Room
                </button>
              </div>
              <select
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
              >
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300 text-sm font-medium" htmlFor="newRoom">
                  New Room Name
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewRoomInput(false)}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Select Existing Room
                </button>
              </div>
              <input
                id="newRoom"
                type="text"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="Enter room name"
                autoComplete="off"
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isCreatingRoom}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 glow-cyan"
          >
            {isCreatingRoom ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Room...
              </div>
            ) : (
              'Join Chat'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}