import { supabase } from "@/integrations/supabase/client";

export async function signUpWithEmail(email: string, password: string, full_name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
      emailRedirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;

  // Check if email is verified
  if (!data.user?.email_confirmed_at) {
    throw new Error('Please verify your email before signing in. Check your inbox for the confirmation link.');
  }

  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`
    }
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function isEmailVerified() {
  const user = await getCurrentUser();
  return user?.email_confirmed_at ? true : false;
}

export async function resendVerificationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
}
