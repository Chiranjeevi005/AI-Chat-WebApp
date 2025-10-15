'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestSupabaseConnection() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic Supabase connection by trying to access rooms table
        const { data, error, count } = await supabase
          .from('rooms')
          .select('count()', { count: 'exact' });
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('Failed');
          setError(`Error: ${error.message}`);
        } else {
          setConnectionStatus('Connected Successfully');
          setTestResults({
            message: 'Supabase connection successful',
            count: count,
            data: data
          });
          console.log('Supabase connection successful:', { data, count });
        }
      } catch (err) {
        console.error('Connection test error:', err);
        setConnectionStatus('Failed');
        setError(`Error: ${(err as Error).message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <span className="text-gray-300">Connection Status:</span>
            <span className={`font-bold ${connectionStatus === 'Connected Successfully' ? 'text-green-400' : 'text-red-400'}`}>
              {connectionStatus}
            </span>
          </div>
          
          {error && (
            <div className="p-4 bg-red-900/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {testResults && (
            <div className="p-4 bg-green-900/50 rounded-lg">
              <p className="text-green-300 text-sm">{testResults.message}</p>
              {testResults.count !== undefined && (
                <p className="text-green-300 text-sm mt-1">Room count: {testResults.count}</p>
              )}
            </div>
          )}
          
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <h2 className="text-gray-300 font-medium mb-2">Next Steps:</h2>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>1. Visit <a href="/" className="text-cyan-400 hover:text-cyan-300">Home Page</a> to start using the chat</li>
              <li>2. Sign up for a new account or log in with existing credentials</li>
              <li>3. Start chatting in real-time with AI assistance</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Retry Connection
            </button>
            <a 
              href="/"
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-center"
            >
              Go to Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}