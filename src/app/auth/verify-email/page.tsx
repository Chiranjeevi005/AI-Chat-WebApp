'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, verifyEmail } = useAuthContext();

  useEffect(() => {
    // If user is already verified, redirect to chat
    if (user?.email_confirmed_at) {
      router.push('/chat-session');
    }

    // Check if we have token and email in URL parameters
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const type = searchParams.get('type');

    if (token && email) {
      handleEmailVerification(email, token, type || 'signup');
    }

    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, user, router, searchParams]);

  const handleEmailVerification = async (email: string, token: string, type: string) => {
    setIsVerifying(true);
    setVerificationStatus('pending');

    try {
      await verifyEmail(email, token, type as any);
      setVerificationStatus('success');
      // Redirect to chat after successful verification
      setTimeout(() => {
        router.push('/chat-session');
      }, 2000);
    } catch (err) {
      console.error('Email verification error:', err);
      setVerificationStatus('error');
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    // In a real implementation, you would call Supabase to resend the verification email
    setTimeLeft(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800/90 glass rounded-2xl p-8 w-full max-w-md border border-gray-700 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {isVerifying ? (
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            ) : verificationStatus === 'success' ? (
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : verificationStatus === 'error' ? (
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isVerifying ? 'Verifying Email' : 
             verificationStatus === 'success' ? 'Email Verified!' : 
             verificationStatus === 'error' ? 'Verification Failed' : 
             'Check Your Email'}
          </h1>
          <p className="text-gray-400">
            {isVerifying ? 'Please wait while we verify your email address...' :
             verificationStatus === 'success' ? 'Your email has been successfully verified. Redirecting to chat...' :
             verificationStatus === 'error' ? 'Failed to verify your email. The link may have expired.' :
             `We've sent a verification link to ${user?.email || 'your email'}`}
          </p>
        </div>

        {verificationStatus === 'pending' && (
          <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
            <p className="text-gray-300 text-sm">
              Please check your email and click the verification link to activate your account.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Note: Some email providers may place verification emails in spam/junk folders.
            </p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="bg-red-900/50 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">
              The verification link may have expired or is invalid. Please request a new verification email.
            </p>
          </div>
        )}

        {verificationStatus !== 'success' && (
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
        )}

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