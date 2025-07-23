'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, options?: { data?: Record<string, unknown> }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error: unknown }>;
  refreshSession: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Create Supabase client outside component to avoid recreation on every render
// Using singleton supabase client imported from utils

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database via API (bypasses RLS issues)
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for userId:', userId);
      
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Error fetching user profile via API:', {
          status: response.status,
          statusText: response.statusText,
          userId
        });
        return null;
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('API returned error:', result.error, 'userId:', userId);
        return null;
      }

      console.log('Successfully fetched user profile:', result.profile?.email);
      return result.profile as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile (catch block):', error, 'userId:', userId);
      return null;
    }
  }, []);

  // Create user profile after successful signup
  const createUserProfile = useCallback(async (user: User): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Add a small delay to ensure session is fully established
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Fetch user profile
          let profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            console.log('Profile not found, attempting to create new profile for user:', session.user.email);
            try {
              // If profile doesn't exist, create it (e.g., for OAuth sign-ins)
              await createUserProfile(session.user);
              profile = await fetchUserProfile(session.user.id); // Fetch again after creation
            } catch (createError) {
              console.log('Profile creation failed (may already exist), retrying fetch:', createError);
              // Profile might have been created by another process, try fetching again
              profile = await fetchUserProfile(session.user.id);
            }
          }
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, createUserProfile]);

  // Authentication methods
  const signUp = async (email: string, password: string, options?: { data?: Record<string, unknown> }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (!error && data.user) {
      // Create user profile
      await createUserProfile(data.user);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Clear user state immediately on successful sign out
        setUser(null);
        setUserProfile(null);
        setSession(null);
      }
      return { error };
    } catch (err) {
      console.error('Error signing out:', err);
      return { error: err as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      // Refresh user profile
      const updatedProfile = await fetchUserProfile(user.id);
      setUserProfile(updatedProfile);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return;
    }

    setSession(session);
    setUser(session?.user || null);

    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hooks for common auth patterns
export function useUser() {
  const { user, userProfile, loading } = useAuth();
  return { user, userProfile, loading };
}

export function useSession() {
  const { session, loading } = useAuth();
  return { session, loading };
}

export function useAuthActions() {
  const { signUp, signIn, signOut, resetPassword, updateProfile, refreshSession, signInWithGoogle } = useAuth();
  return { signUp, signIn, signOut, resetPassword, updateProfile, refreshSession, signInWithGoogle };
}