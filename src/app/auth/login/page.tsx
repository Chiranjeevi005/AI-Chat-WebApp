'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParamsRef = useRef<URLSearchParams | null>(null);
  const { signInWithPassword, isAuthenticated, user, resetError } = useAuthContext();

  // Initialize searchParamsRef after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      searchParamsRef.current = new URLSearchParams(window.location.search);
    }
  }, []);

  // Get error from URL parameters
  useEffect(() => {
    const errorParam = searchParamsRef.current?.get('error');
    const messageParam = searchParamsRef.current?.get('message');
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else if (messageParam) {
      setError(decodeURIComponent(messageParam));
    }
  }, []);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      // Add a small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        const redirect = searchParamsRef.current?.get('redirect');
        // Special handling for admin user - check the authenticated user's email
        if (user.email === 'chiranjeevi8050@gmail.com') {
          router.push(redirect || '/admin');
        } else {
          router.push(redirect || '/chat-session');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, router]);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    resetError();

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
      // The redirect will be handled by the auth hook and the useEffect above
      // Add a small delay to ensure state updates properly
      setTimeout(() => {
        if (isAuthenticated && user) {
          const redirect = searchParamsRef.current?.get('redirect');
          if (user.email === 'chiranjeevi8050@gmail.com') {
            router.push(redirect || '/admin');
          } else {
            router.push(redirect || '/chat-session');
          }
        }
      }, 300);
    } catch (err: unknown) {
      console.error('Login error:', err);
      // Provide more user-friendly error messages
      if (err instanceof Error) {
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
          
          <div className="text-center mb-4">
            <Link href="/auth/forgot-password" className="text-cyan-400 hover:text-cyan-300 text-sm">
              Forgot Password?
            </Link>
          </div>
        </form>

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