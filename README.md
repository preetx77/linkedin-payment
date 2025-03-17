
# Portable Authentication System

This project includes a modular authentication system built with React and Supabase that can be easily imported into other AI code editors like Cursor AI.

## How to Import into Another Project

### 1. Copy the Required Files

Copy these files to your new project:

- `src/lib/auth/AuthContext.tsx`
- `src/lib/auth/ProtectedRoute.tsx`
- `src/lib/auth/setupAuth.tsx`
- `src/integrations/supabase/client.ts`

### 2. Setup Supabase

Make sure to configure your Supabase client with your project URL and key:

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "your-supabase-url";
const SUPABASE_PUBLISHABLE_KEY = "your-supabase-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

### 3. Add Authentication to Your App

```typescript
// App.tsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/auth/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider
        redirectOnLogin="/dashboard"
        redirectOnLogout="/"
      >
        {/* Your app components */}
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 4. Create Protected Routes

```typescript
// YourProtectedPage.tsx
import ProtectedRoute from "./lib/auth/ProtectedRoute";

function YourApp() {
  return (
    <Routes>
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
  );
}
```

### 5. Use Authentication in Components

```typescript
import { useAuth } from "./lib/auth/AuthContext";

function YourComponent() {
  const { user, login, logout, signUp, googleAuth, loading } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Successfully logged in
    } else {
      // Handle error
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Authentication Features

This system provides:

- Email/password login and signup
- Google OAuth authentication
- Protected routes
- User state management
- Loading states
- Customizable redirects
- Error handling

## Customization

You can customize the authentication behavior by passing props to the `AuthProvider`:

```typescript
<AuthProvider
  redirectOnLogin="/custom-redirect"
  redirectOnLogout="/"
  onAuthStateChange={(user) => console.log("Auth state changed:", user)}
  onAuthError={(error) => console.error("Auth error:", error)}
>
  {/* Your app */}
</AuthProvider>
```

## Requirements

- React
- Supabase JavaScript client
- React Router (for navigation)
```
