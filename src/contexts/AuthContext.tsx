'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, options?: { username?: string }) => Promise<any | null>;
  signInWithPassword: (email: string, password: string) => Promise<any | null>;
  signOut: () => Promise<void>;
  resetError: () => void;
  verifyEmail: (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery' | 'invite') => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider
 * This component provides authentication context to the entire application
 * It wraps the useAuth hook and makes it available through context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuthContext hook
 * This hook provides access to the authentication context
 * It must be used within an AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}