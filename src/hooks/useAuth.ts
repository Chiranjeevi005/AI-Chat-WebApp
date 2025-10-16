'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  signInWithOAuth: (provider: 'google', redirectUrl?: string) => Promise<any>;
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
  
  // Get router at the top level
  const router = useRouter();
  
  // Use refs to store router to avoid re-renders and timing issues
  const routerRef = useRef<any>(null);
  const isRouterInitialized = useRef(false);

  // Initialize router after component mounts
  useEffect(() => {
    // Initialize router on client side after mounting
    if (typeof window !== 'undefined') {
      routerRef.current = router;
      isRouterInitialized.current = true;
    }
  }, [router]);

  // Function to ensure user profile exists
  const ensureUserProfile = useCallback(async (user: User) => {
    if (!user) return;

    try {
      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError || !profileData) {
        const { error: insertProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
            role: user.email === 'chiranjeevi8050@gmail.com' ? 'admin' : 'user' // Set admin role for designated user
          }]);

        if (insertProfileError) {
          console.error('Error creating user profile:', insertProfileError);
          console.error('Profile error details:', {
            code: insertProfileError.code,
            details: insertProfileError.details,
            hint: insertProfileError.hint,
            message: insertProfileError.message
          });
        }
      } else {
        // If profile exists, check if it should be admin
        if (user.email === 'chiranjeevi8050@gmail.com') {
          // Update role to admin if needed
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          if (updateProfileError) {
            console.error('Error updating user profile to admin:', updateProfileError);
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      if (error && typeof error === 'object' && (error as any).message) {
        console.error('Profile error message:', (error as any).message);
      }
    }
  }, []);

  // Check initial session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Ensure user profile exists
          await ensureUserProfile(session.user);
        }
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
      async (_event, session) => {
        if (session?.user) {
          // Ensure user profile exists
          await ensureUserProfile(session.user);
        }
        
        setAuthState({
          user: session?.user || null,
          session: session,
          loading: false,
          error: null
        });
        
        // Handle redirects based on auth state - but only for sign in events
        if (_event === 'SIGNED_IN' && session) {
          // User logged in - let the login page handle the redirect
          // The login page has more context about the user's intent
          return;
        }
        
        // Handle logout events
        if (_event === 'SIGNED_OUT') {
          // User logged out
          if (typeof window !== 'undefined' && routerRef.current) {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/chat-session') || currentPath.startsWith('/profile') || currentPath.startsWith('/admin')) {
              routerRef.current.push('/auth/login');
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [ensureUserProfile]);

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
      
      // If signup was successful, create the user profile
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            username: options?.username || email.split('@')[0],
            role: email === 'chiranjeevi8050@gmail.com' ? 'admin' : 'user' // Set admin role for designated user
          }])
          .select()
          .single();

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          console.error('Profile error details:', {
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint,
            message: profileError.message
          });
          // Don't throw here as the signup itself was successful
        }
      }
      
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
  const signInWithOAuth = useCallback(async (provider: 'google', redirectUrl?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Ensure router is initialized before proceeding
      if (!isRouterInitialized.current) {
        throw new Error('Navigation is not available at the moment. Please try again.');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectUrl || '/chat-session'}`
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
      
      // Ensure profile exists after email verification
      if (data?.user) {
        await ensureUserProfile(data.user);
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to verify email';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, [ensureUserProfile]);

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