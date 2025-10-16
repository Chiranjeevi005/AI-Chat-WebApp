'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SeedRoomsPage() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeedRooms = async () => {
    setSeeding(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/seed-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || data.message || 'Failed to seed rooms');
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Initialize Chat Rooms</h1>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <h2 className="text-lg font-medium text-gray-300 mb-2">About Room Initialization</h2>
            <p className="text-gray-400 text-sm">
              This tool will create initial rooms in your Supabase database for users to see when they first access the application.
            </p>
            
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-300 mb-2">Initial Rooms:</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Welcome Lounge - For newcomers to introduce themselves</li>
                <li>• AI Brainstorming - Collaborate with AI on creative ideas</li>
                <li>• Tech Talk - Discuss technology and programming</li>
                <li>• Design Studio - Share design concepts and get feedback</li>
                <li>• Random Chit Chat - Light-hearted conversations</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSeedRooms}
              disabled={seeding}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                seeding 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              {seeding ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Initializing Rooms...
                </div>
              ) : (
                'Initialize Rooms'
              )}
            </button>
            
            <Link 
              href="/"
              className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-center transition-colors"
            >
              Back to Chat
            </Link>
          </div>
          
          {error && (
            <div className="p-4 bg-red-900/50 rounded-lg">
              <p className="text-red-300 text-sm">Error: {error}</p>
            </div>
          )}
          
          {result && (
            <div className="p-4 bg-green-900/50 rounded-lg">
              <p className="text-green-300 text-sm">{result.message}</p>
              {result.rooms && (
                <div className="mt-3">
                  <p className="text-green-300 text-sm">Created rooms:</p>
                  <ul className="text-green-300 text-sm mt-1 list-disc list-inside">
                    {result.rooms.map((room: any) => (
                      <li key={room.id}>{room.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
