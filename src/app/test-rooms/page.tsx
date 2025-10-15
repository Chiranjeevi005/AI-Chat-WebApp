'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        setRooms(data || []);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError((err as Error).message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Rooms Test</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-300">Loading rooms...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/50 rounded-lg">
            <p className="text-red-300 text-sm">Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-300">Rooms ({rooms.length})</h2>
              <a 
                href="/"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Back to Chat
              </a>
            </div>
            
            {rooms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No rooms found. Create your first room to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h3 className="font-medium text-white">{room.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Created: {new Date(room.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}