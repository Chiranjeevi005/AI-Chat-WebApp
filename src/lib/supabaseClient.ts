import { createClient } from '@supabase/supabase-js';

// Removed sensitive logging for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  // Removed logging of actual values for security
  throw new Error('Missing Supabase environment variables');
}

// Removed logging of URL for security

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-chat-app',
    },
  },
});

// Removed success logging for security

// Export types for better TypeScript support
export type { Session, User } from '@supabase/supabase-js';