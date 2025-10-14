'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      try {
        // Get the current session - Supabase will automatically handle the OAuth tokens
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.push(`/auth/login?error=${encodeURIComponent(error.message)}`);
          return;
        }

        if (data.session) {
          // Successfully authenticated, check for redirect parameter
          const redirect = searchParams.get('redirect');
          console.log('OAuth successful, redirecting to:', redirect || '/chat-session');
          router.push(redirect || '/chat-session');
        } else {
          // No session, redirect to login
          console.log('No session found after OAuth');
          router.push('/auth/login?error=authentication_failed');
        }
      } catch (err) {
        console.error('Error in OAuth callback:', err);
        router.push('/auth/login?error=oauth_callback_failed');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Completing Authentication</h2>
        <p className="text-gray-400">Please wait while we complete your sign in process...</p>
      </div>
    </div>
  );
}