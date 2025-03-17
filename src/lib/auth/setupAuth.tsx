
import React from 'react';
import AuthProvider, { type AuthProviderProps } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

/**
 * Exports all authentication-related components and hooks for easy importing in other projects
 */
export {
  AuthProvider,
  ProtectedRoute,
  useAuth
} from './AuthContext';

/**
 * A higher-order component to set up authentication for an entire application
 */
export const withAuth = (Component: React.ComponentType, authProps?: Omit<AuthProviderProps, 'children'>) => {
  return function WithAuthComponent(props: any) {
    return (
      <AuthProvider {...authProps}>
        <Component {...props} />
      </AuthProvider>
    );
  };
};

/**
 * An easy way to set up authentication using the authentication system
 */
export const setupAuth = {
  /**
   * Initialize authentication in your application
   */
  init: (options?: Omit<AuthProviderProps, 'children'>) => {
    return {
      AuthProvider: (props: { children: React.ReactNode }) => (
        <AuthProvider {...options} {...props} />
      ),
      ProtectedRoute
    };
  }
};

export default setupAuth;
