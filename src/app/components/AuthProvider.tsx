'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, username?: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      console.log('Checking initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check result:', session);
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          console.log('Auth state changed:', _event, session);
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    checkSession();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    
    if (error) throw error;
    return data;
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    // More robust check for authentication
    return !loading && !!user && (!!user.id || !!user.email);
  };

  const value = {
    user,
    session,
    signUp,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    loading,
    isAuthenticated
  };

  // Always render children regardless of loading state
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}