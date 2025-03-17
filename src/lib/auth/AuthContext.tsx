
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

// Define user type
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Define the context type
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signUp: (name: string, email: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<{success: boolean, error?: string}>;
  googleAuth: () => Promise<{success: boolean, error?: string}>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (user: AuthUser | null) => void;
  onAuthError?: (error: string) => void;
  redirectOnLogin?: string;
  redirectOnLogout?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  onAuthStateChange,
  onAuthError,
  redirectOnLogin,
  redirectOnLogout
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to show errors
  const handleError = (message: string) => {
    console.error(message);
    if (onAuthError) onAuthError(message);
  };

  // Helper function to navigate if needed
  const handleRedirect = (path?: string) => {
    if (path && typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (session) {
          // User is signed in
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || session.user.email?.split('@')[0]
          };
          setUser(userData);
          if (onAuthStateChange) onAuthStateChange(userData);
        } else {
          // User is signed out
          setUser(null);
          if (onAuthStateChange) onAuthStateChange(null);
        }
        setLoading(false);
      }
    );

    // Check current session on initial load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || session.user.email?.split('@')[0]
          };
          setUser(userData);
          if (onAuthStateChange) onAuthStateChange(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthStateChange]);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleError(error.message);
        return { success: false, error: error.message };
      }

      handleRedirect(redirectOnLogin);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to login. Please try again.';
      handleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        handleError(error.message);
        return { success: false, error: error.message };
      }

      handleRedirect(redirectOnLogin);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create account. Please try again.';
      handleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleError(error.message);
        return { success: false, error: error.message };
      }
      
      handleRedirect(redirectOnLogout);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to log out. Please try again.';
      handleError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Google authentication
  const googleAuth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectOnLogin ? 
            `${window.location.origin}${redirectOnLogin}` : 
            `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        handleError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to login with Google. Please try again.';
      handleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signUp,
    logout,
    googleAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
