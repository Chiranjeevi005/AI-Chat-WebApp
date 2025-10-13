'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp, isAuthenticated } = useAuth();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Check for the specific invalid email that Supabase rejects
    if (email === 'user@example.com') {
      setError('Please use a valid email address. "user@example.com" is not accepted.');
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, username);
      // Redirect to a page indicating email verification is needed
      router.push('/auth/verify-email');
    } catch (err: any) {
      console.error('Signup error:', err);
      // Provide more user-friendly error messages
      if (err.message) {
        if (err.message.includes('Email address is invalid')) {
          setError('Please enter a valid email address. Some email providers may not be accepted.');
        } else if (err.message.includes('duplicate')) {
          setError('An account with this email already exists');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to create account. Please try again with a different email address.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800/90 glass rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our AI-powered chat experience</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
              placeholder="Enter your username"
              required
            />
          </div>

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
            <p className="text-gray-500 text-xs mt-1">Please use a real email address for verification</p>
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
              minLength={6}
            />
            <p className="text-gray-500 text-xs mt-1">At least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 glow-cyan mb-4"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}