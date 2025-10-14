'use client';

import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/contexts/AuthContext';

export default function TestImports() {
  // Just testing that imports work
  console.log('Supabase client:', supabase);
  console.log('useAuth hook:', useAuth);
  console.log('useAuthContext hook:', useAuthContext);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">Import Test</h1>
        <p>All imports are working correctly!</p>
      </div>
    </div>
  );
}