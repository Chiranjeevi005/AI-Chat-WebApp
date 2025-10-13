'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';

export default function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If user is already verified, redirect to chat
    if (user?.email_confirmed_at) {
      router.push('/chat-session');
    }

    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, user, router]);

  const handleResendEmail = async () => {
    // In a real implementation, you would call Supabase to resend the verification email
    setTimeLeft(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800/90 glass rounded-2xl p-8 w-full max-w-md border border-gray-700 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-gray-400">
            We've sent a verification link to <span className="text-cyan-400">{user?.email}</span>
          </p>
        </div>

        <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm">
            Please check your email and click the verification link to activate your account.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Note: Some email providers may place verification emails in spam/junk folders.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            Didn't receive the email?{' '}
            <button
              onClick={handleResendEmail}
              disabled={timeLeft > 0}
              className={`text-cyan-400 hover:text-cyan-300 ${timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Resend {timeLeft > 0 ? `(${timeLeft}s)` : ''}
            </button>
          </p>
        </div>

        <button
          onClick={() => router.push('/auth/login')}
          className="w-full py-3 bg-gray-700 rounded-xl text-gray-300 font-bold hover:bg-gray-600 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}