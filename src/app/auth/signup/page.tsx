'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  const { signUp, resetError } = useAuthContext();

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isStrongPassword = (password: string) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e: React.FormEvent) => {
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

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and number');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, { username });
      // After successful signup, show success message
      setShowSuccessMessage(true);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        if (err.message.includes('already registered')) {
          setError('An account with this email already exists');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccessMessage) {
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
              We've sent a verification link to <span className="text-cyan-400">{email}</span>
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

          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-3 bg-gray-700 rounded-xl text-gray-300 font-bold hover:bg-gray-600 transition-colors"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800/90 glass rounded-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our chat platform</p>
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
              placeholder="Choose a username"
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
          </div>

          <div className="mb-4">
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
            <p className="text-gray-500 text-xs mt-1">At least 8 characters with uppercase, lowercase, and number</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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