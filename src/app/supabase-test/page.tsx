'use client';

import { useEffect, useState } from 'react';

export default function SupabaseTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        const response = await fetch('/api/test-supabase');
        const data = await response.json();
        setTestResult(data);
      } catch (err) {
        setError('Failed to connect to Supabase API');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Integration</h1>
      
      {loading && (
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl">
          <p className="text-gray-400">Testing Supabase connection...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-red-300">Error</h2>
          <p className="text-red-200">{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-300">Success:</h3>
              <p className={testResult.success ? "text-green-400" : "text-red-400"}>
                {testResult.success ? '✅ Yes' : '❌ No'}
              </p>
            </div>
            
            {testResult.message && (
              <div>
                <h3 className="font-medium text-gray-300">Message:</h3>
                <p className="text-cyan-400">{testResult.message}</p>
              </div>
            )}
            
            {testResult.count !== undefined && (
              <div>
                <h3 className="font-medium text-gray-300">Room Count:</h3>
                <p className="text-cyan-400">{testResult.count}</p>
              </div>
            )}
            
            {testResult.error && (
              <div>
                <h3 className="font-medium text-gray-300">Error:</h3>
                <p className="text-red-400">{testResult.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-gray-800 rounded-lg p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Check the results above to see if Supabase integration is working</li>
          <li>If successful, you can proceed with using the chat application</li>
          <li>If there are errors, check your Supabase credentials and database setup</li>
        </ul>
      </div>
    </div>
  );
}