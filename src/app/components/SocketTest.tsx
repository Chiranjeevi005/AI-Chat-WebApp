'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/utils/socket';

export default function SocketTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id || '');
      console.log('Socket connected in component with ID:', socket.id);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setSocketId('');
      console.log('Socket disconnected in component');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Emit a test event to trigger connection
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Socket.IO Connection Status</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {isConnected && <p>Socket ID: {socketId}</p>}
      <p className="mt-2 text-sm text-gray-600">
        Check browser console and server logs for connection details
      </p>
    </div>
  );
}