'use client';

import { useEffect } from 'react';
import { getSocket } from '@/utils/socket';

export default function TestPage() {
  useEffect(() => {
    const socket = getSocket();
    
    socket.on('connect', () => {
      console.log('Socket connected in client');
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected in client');
    });
    
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Socket.IO Test</h1>
      <p className="text-lg">Check the browser console for Socket.IO connection logs</p>
    </div>
  );
}