'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const searchParamsRef = useRef<URLSearchParams | null>(null);

  useEffect(() => {
    // Initialize after component mounts
    if (typeof window !== 'undefined') {
      setIsClient(true);
      searchParamsRef.current = new URLSearchParams(window.location.search);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Handle OAuth callback and email verification
    const handleCallback = async () => {
      try {
        // Check if this is an email verification callback
        const token = searchParamsRef.current?.get('token');
        const email = searchParamsRef.current?.get('email');
        const type = searchParamsRef.current?.get('type');

        if (token && email && type) {
          // This is an email verification callback
          // Supabase will automatically handle the verification
          // We just need to redirect after a short delay to allow the verification to complete
          setTimeout(() => {
            router.push('/chat-session');
          }, 2000);
          return;
        }

        // Handle OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.push(`/auth/login?error=${encodeURIComponent(error.message)}`);
          return;
        }

        if (data.session) {
          // Successfully authenticated, check for redirect parameter
          const redirect = searchParamsRef.current?.get('redirect');
          console.log('OAuth successful, redirecting to:', redirect || '/chat-session');
          router.push(redirect || '/chat-session');
        } else {
          // No session, redirect to login
          console.log('No session found after OAuth');
          router.push('/auth/login?error=authentication_failed');
        }
      } catch (err) {
        console.error('Error in callback:', err);
        router.push('/auth/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [router, isClient]);

  if (!isClient) {
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