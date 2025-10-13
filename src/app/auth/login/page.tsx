'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const router = useRouter();
  const { signInWithPassword, signInWithGoogle } = useAuth();

  // Get error from URL parameters
  const getUrlParams = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return {
        error: params.get('error'),
      };
    }
    return { error: null };
  };

  const urlParams = getUrlParams();
  
  // Set error from URL if present
  useState(() => {
    if (urlParams.error) {
      setError(decodeURIComponent(urlParams.error));
    }
  });

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      // Note: signInWithGoogle will redirect the user, so we don't need to do anything here
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithPassword(email, password);
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      // Provide more user-friendly error messages
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800/90 glass rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your conversation</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex mb-6 bg-gray-700/50 rounded-xl p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              authMethod === 'email'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setAuthMethod('email')}
          >
            Email
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              authMethod === 'google'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setAuthMethod('google')}
          >
            Google
          </button>
        </div>

        {authMethod === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="you@example.com"
                required
              />
              <p className="text-gray-500 text-xs mt-1">Use the email you signed up with</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 glow-cyan mb-4"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {authMethod === 'google' && (
          <div className="text-center">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-white rounded-xl text-gray-900 font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              You will be redirected to Google to complete authentication
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}