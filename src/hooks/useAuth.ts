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
  signOut: () => Promise<void>;
  resetError: () => void;
  verifyEmail: (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery' | 'invite') => Promise<any>;
}

/**
 * Custom hook for authentication management
 * Provides a complete authentication solution with session management
 * and error handling
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
          console.error('Detailed error info:', {
            message: insertProfileError.message,
            code: insertProfileError.code,
            details: insertProfileError.details,
            hint: insertProfileError.hint
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
        // Handle refresh token errors specifically
        if (error instanceof Error && error.message.includes('Refresh Token')) {
          // Clear local storage and sign out
          await supabase.auth.signOut();
          setAuthState(prev => ({
            ...prev,
            user: null,
            session: null,
            loading: false,
            error: 'Session expired. Please sign in again.'
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to check authentication status'
          }));
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Handle auth errors
        if (_event === 'SIGNED_OUT' || !session) {
          // User logged out or session invalid
          setAuthState(prev => ({
            ...prev,
            user: null,
            session: null,
            loading: false
          }));
          
          if (typeof window !== 'undefined' && routerRef.current) {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/chat-session') || currentPath.startsWith('/profile') || currentPath.startsWith('/admin')) {
              routerRef.current.push('/auth/login');
            }
          }
          return;
        }
        
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
    // Demo credentials
    const demoEmail = "project.evaluation@unifiedmentor.com";
    const demoPassword = "DemoPassword123";
    
    // Check for demo credentials
    if (email === demoEmail && password === demoPassword) {
      try {
        // For demo credentials, we'll create a temporary user that goes through the same flow
        // Create a mock user that mimics a real Supabase user
        const mockUser = {
          id: 'demo-user-id',
          email: demoEmail,
          user_metadata: {
            username: 'demo-user',
            display_name: 'Demo User'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User;
        
        // Set auth state with mock data
        setAuthState(prev => ({ 
          ...prev, 
          user: mockUser,
          loading: false 
        }));
        
        // Store demo flag in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('isDemoUser', 'true');
        }
        
        // Handle redirect after successful login
        if (typeof window !== 'undefined') {
          // Check for redirect parameter in URL
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get('redirect');
          
          // Use setTimeout to ensure state updates are processed
          setTimeout(() => {
            if (redirect) {
              router.push(`${redirect}?demo=true`);
            } else {
              router.push('/chat-session?demo=true');
            }
          }, 100);
        }
        
        return { user: mockUser };
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to sign in as demo user';
        setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    }
    
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // Ensure user profile exists
      if (data?.user) {
        await ensureUserProfile(data.user);
      }
      
      // Update auth state with the new session
      setAuthState(prev => ({ 
        ...prev, 
        user: data?.user || null,
        session: data?.session || null,
        loading: false 
      }));
      
      // Handle redirect after successful login
      if (typeof window !== 'undefined' && data?.user) {
        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          if (redirect) {
            router.push(redirect);
          } else if (data.user.email === 'chiranjeevi8050@gmail.com') {
            router.push('/admin');
          } else if (data.user.email === demoEmail) {
            router.push('/chat-session?demo=true');
          } else {
            router.push('/chat-session');
          }
        }, 100);
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      // Handle refresh token errors specifically
      if (errorMessage.includes('Refresh Token')) {
        setAuthState(prev => ({ ...prev, error: 'Session expired. Please sign in again.', loading: false }));
      } else {
        setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      }
      throw error;
    }
  }, [ensureUserProfile, router]);

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
      
      // Clean up demo flag
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isDemoUser');
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Update auth state immediately
      setAuthState(prev => ({ 
        ...prev, 
        user: null,
        session: null,
        loading: false 
      }));
      
      // Redirect to login page using Next.js router
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign out';
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
      console.error('Sign out error:', error);
      throw error;
    }
  }, [router]);

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
    signOut,
    resetError,
    verifyEmail
  };
}