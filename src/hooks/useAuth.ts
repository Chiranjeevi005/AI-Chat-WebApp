'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthHook {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, options?: { username?: string }) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithOAuth: (provider: 'google') => Promise<any>;
  signOut: () => Promise<void>;
  resetError: () => void;
  verifyEmail: (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery' | 'invite') => Promise<any>;
}

/**
 * Custom hook for authentication management
 * Provides a complete authentication solution with session management,
 * OAuth integration, and error handling
 */
export function useAuth(): AuthHook {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });
  
  // Get router and searchParams at the top level
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use refs to store router and searchParams to avoid re-renders and timing issues
  const routerRef = useRef<any>(null);
  const searchParamsRef = useRef<any>(null);
  const isRouterInitialized = useRef(false);

  // Initialize router and searchParams after component mounts
  useEffect(() => {
    // Initialize router on client side after mounting
    if (typeof window !== 'undefined') {
      routerRef.current = router;
      searchParamsRef.current = searchParams;
      isRouterInitialized.current = true;
    }
  }, [router, searchParams]);

  // Check initial session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          session: session,
          loading: false
        }));
      } catch (error) {
        console.error('Error checking session:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to check authentication status'
        }));
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({
          user: session?.user || null,
          session: session,
          loading: false,
          error: null
        });
        
        // Handle redirects based on auth state
        if (session) {
          // User logged in
          if (typeof window !== 'undefined' && routerRef.current) {
            const currentPath = window.location.pathname;
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            // Always check for redirect parameter after login, regardless of current path
            if (redirect && currentPath.startsWith('/auth')) {
              // Redirect to the specified page
              routerRef.current.push(redirect);
            } else if (currentPath.startsWith('/auth') && !currentPath.startsWith('/auth/callback')) {
              // If on auth pages but no redirect parameter, go to chat-session
              routerRef.current.push('/chat-session');
            }
          }
        } else {
          // User logged out
          if (typeof window !== 'undefined' && routerRef.current) {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/chat-session') || currentPath.startsWith('/profile')) {
              routerRef.current.push('/auth/login');
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, options?: { username?: string }) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: options?.username
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign up';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  // Sign in with email and password
  const signInWithPassword = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  // Sign in with OAuth provider
  const signInWithOAuth = useCallback(async (provider: 'google') => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Ensure router is initialized before proceeding
      if (!isRouterInitialized.current) {
        throw new Error('Navigation is not available at the moment. Please try again.');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${searchParamsRef.current?.get('redirect') || '/chat-session'}`
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || `Failed to sign in with ${provider}`;
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  // Verify email with token
  const verifyEmail = useCallback(async (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery' | 'invite' = 'signup') => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to verify email';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Redirect to login page
      if (routerRef.current) {
        routerRef.current.push('/auth/login');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign out';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  // Reset error state
  const resetError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Memoized authentication status
  const isAuthenticated = useMemo(() => {
    return !authState.loading && !!authState.user;
  }, [authState.loading, authState.user]);

  return {
    ...authState,
    isAuthenticated,
    signUp,
    signInWithPassword,
    signInWithOAuth,
    signOut,
    resetError,
    verifyEmail
  };
}