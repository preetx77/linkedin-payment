
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleAuth: () => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for stored user on initial load
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating authentication API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, validate credentials with a backend
      if (email && password) {
        // Demo user - in a real app, this would come from your backend
        const userData: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0]
        };
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Success",
          description: "You've successfully logged in",
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating registration API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password) {
        // Create new user - in a real app, this would be handled by your backend
        const userData: User = {
          id: `user-${Date.now()}`,
          email,
          name
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Success",
          description: "Your account has been created",
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  // Google authentication
  const googleAuth = async () => {
    setLoading(true);
    try {
      // Simulating Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo Google user - in a real app, this would come from Google OAuth
      const userData: User = {
        id: `google-user-${Date.now()}`,
        email: 'user@gmail.com',
        name: 'Google User'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Success",
        description: "You've successfully logged in with Google",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
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
