'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function TestChatAccess() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        console.log('Session data:', session);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToChat = () => {
    router.push('/chat-session');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Chat Access Test</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Session Status</h2>
          <div className="bg-gray-700 rounded p-4">
            {session ? (
              <div>
                <p className="text-green-400 mb-2">Authenticated</p>
                <p className="text-white"><strong>User ID:</strong> {session.user.id}</p>
                <p className="text-white"><strong>Email:</strong> {session.user.email}</p>
              </div>
            ) : (
              <p className="text-red-400">Not authenticated</p>
            )}
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
            className={`px-4 py-2 rounded transition-colors ${
              session 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!session}
          >
            Go to Chat (Protected)
          </button>
        </div>
      </div>
    </div>
  );
}