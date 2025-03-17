
import React from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  redirectTo?: string;
}

/**
 * A component that protects routes by only rendering children if the user is authenticated.
 * Can be customized with loading and fallback components.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback, 
  loadingComponent, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();

  // If authentication is still loading, show the loading component
  if (loading) {
    return <>{loadingComponent || <div>Loading...</div>}</>;
  }

  // If user is not authenticated, show fallback or redirect
  if (!user) {
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
      return null;
    }
    return <>{fallback || null}</>;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
