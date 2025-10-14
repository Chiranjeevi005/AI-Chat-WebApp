'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestSupabasePage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        // Test 1: Get session
        const sessionResult = await supabase.auth.getSession();
        console.log('Session result:', sessionResult);
        
        // Test 2: Get user
        const userResult = await supabase.auth.getUser();
        console.log('User result:', userResult);
        
        setTestResult({
          session: sessionResult,
          user: userResult,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        console.error('Supabase test error:', error);
        setTestResult({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    testSupabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Testing Supabase connection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Test Results</h2>
        <pre className="bg-gray-700 p-2 rounded overflow-x-auto">
          {JSON.stringify(testResult, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Refresh Test
        </button>
      </div>
    </div>
  );
}