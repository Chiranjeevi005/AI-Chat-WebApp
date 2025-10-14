'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export default function TestAuthFlow() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [testState, setTestState] = useState({
    user,
    loading,
    isAuthenticated
  });

  useEffect(() => {
    setTestState({
      user,
      loading,
      isAuthenticated
    });
  }, [user, loading, isAuthenticated]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToChat = () => {
    router.push('/chat-session');
  };

  const handleForceRedirect = () => {
    window.location.href = '/chat-session';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Flow Test</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Current Auth State</h2>
          <div className="bg-gray-700 rounded p-4 mb-4">
            <p className="text-white mb-2"><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
            <p className="text-white mb-2"><strong>Is Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p className="text-white"><strong>User:</strong> {user ? user.email : 'null'}</p>
          </div>
          
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Test State Snapshot</h2>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-white mb-2"><strong>Loading:</strong> {testState.loading ? 'true' : 'false'}</p>
            <p className="text-white mb-2"><strong>Is Authenticated:</strong> {testState.isAuthenticated ? 'true' : 'false'}</p>
            <p className="text-white"><strong>User:</strong> {testState.user ? testState.user.email : 'null'}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleGoHome}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            Go to Home
          </button>
          <button 
            onClick={handleGoToChat}
            className={`px-4 py-2 rounded transition-colors ${
              isAuthenticated 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isAuthenticated}
          >
            Go to Chat (Next Router)
          </button>
          <button 
            onClick={handleForceRedirect}
            className={`px-4 py-2 rounded transition-colors ${
              isAuthenticated 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isAuthenticated}
          >
            Go to Chat (Force Redirect)
          </button>
        </div>
      </div>
    </div>
  );
}