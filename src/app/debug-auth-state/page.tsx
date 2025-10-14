'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugAuthState() {
  const { user, loading, isAuthenticated, session } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    console.log('Debug Auth State Page - Auth Context Values:', {
      user,
      loading,
      isAuthenticated,
      session
    });
  }, [user, loading, isAuthenticated, session]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToChat = () => {
    router.push('/chat-session');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication State Debug</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Current Auth State</h2>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-white mb-2"><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
            <p className="text-white mb-2"><strong>Is Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p className="text-white mb-2"><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
            <p className="text-white"><strong>Session:</strong> {session ? JSON.stringify(session, null, 2) : 'null'}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleGoHome}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            Go to Home
          </button>
          <button 
            onClick={handleGoToChat}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            disabled={!isAuthenticated}
          >
            Go to Chat (Protected)
          </button>
        </div>
      </div>
    </div>
  );
}