'use client';

import { useEffect, useState } from 'react';

export default function EnvTest() {
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    // Client-side check
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Client-side Environment Variables</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-300">NEXT_PUBLIC_SUPABASE_URL:</h3>
            <p className="text-cyan-400 font-mono break-all">
              {envVars.NEXT_PUBLIC_SUPABASE_URL || 'Not available'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-300">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h3>
            <p className="text-cyan-400 font-mono">
              {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-300">SUPABASE_SERVICE_ROLE_KEY:</h3>
            <p className="text-cyan-400 font-mono">
              {envVars.SUPABASE_SERVICE_ROLE_KEY || 'Not set'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-800 rounded-lg p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Check that the values above are correctly set</li>
          <li>If they appear correct, try restarting the development server</li>
          <li>If issues persist, verify the Supabase project settings</li>
        </ul>
      </div>
    </div>
  );
}