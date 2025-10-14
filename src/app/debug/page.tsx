'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Get session info
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        // Get user info
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        setDebugInfo({
          session: sessionData?.session,
          sessionError: sessionError?.message,
          user: userData?.user,
          userError: userError?.message,
          env: {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
            supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'
          }
        });
      } catch (error: any) {
        console.error('Debug error:', error);
        setDebugInfo({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDebugInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Loading debug information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug Information</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-gray-700 p-2 rounded overflow-x-auto">
          {JSON.stringify(debugInfo?.env, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold mb-2">Session Information</h2>
        {debugInfo?.sessionError ? (
          <div className="text-red-400">Error: {debugInfo.sessionError}</div>
        ) : (
          <pre className="bg-gray-700 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugInfo?.session, null, 2) || 'No session'}
          </pre>
        )}
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        {debugInfo?.userError ? (
          <div className="text-red-400">Error: {debugInfo.userError}</div>
        ) : (
          <pre className="bg-gray-700 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugInfo?.user, null, 2) || 'No user'}
          </pre>
        )}
      </div>
      
      {debugInfo?.error && (
        <div className="bg-red-900 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-semibold mb-2">General Error</h2>
          <pre className="bg-red-800 p-2 rounded overflow-x-auto">
            {JSON.stringify(debugInfo.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}