
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { setupAuth } from '../src/lib/auth/setupAuth';

// Initialize auth system with custom settings
const { AuthProvider, ProtectedRoute } = setupAuth.init({
  redirectOnLogin: '/dashboard',
  redirectOnLogout: '/',
  onAuthStateChange: (user) => {
    console.log('Auth state changed:', user);
  }
});

// Simple components
const LoginPage = () => <div>Login Page</div>;
const DashboardPage = () => <div>Dashboard (Protected Route)</div>;
const HomePage = () => <div>Home Page</div>;

// App with authentication
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute redirectTo="/login">
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
