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
  // GOOGLE AUTH TEMPORARILY DISABLED
  // signInWithGoogle: () => Promise<{ error: AuthError | null }>;
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

  // Fetch user profile via API (bypasses RLS issues)
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for userId:', userId);
      
      // Use proper profile API endpoint
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        console.error('Profile API failed:', response.status, response.statusText);
        return null;
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('Profile API returned error:', result.error);
        return null;
      }

      if (result.profile) {
        console.log('Successfully fetched user profile via API:', result.profile.email);
        return result.profile as UserProfile;
      }

      console.log('No profile found in API response');
      return null;
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
        // Start with session to check if user is logged in
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }

        if (session && session.user) {
          // If we have a session, verify with getUser() for security
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
              console.log('Session exists but user verification failed, clearing session');
              await supabase.auth.signOut();
              return;
            }

            setSession(session);
            setUser(user);
            
            // Fetch user profile
            const profile = await fetchUserProfile(user.id);
            setUserProfile(profile);
          } catch (userError) {
            console.log('User verification failed, using session user:', userError);
            // Fallback to session user if getUser() fails
            setSession(session);
            setUser(session.user);
            
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
          }
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
          
          // For auth state changes, we can trust the session user
          // since this is triggered by actual auth events
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

  /* GOOGLE AUTH TEMPORARILY DISABLED - 2025-01-24
   * 
   * This function was disabled because Google OAuth provider is not configured in Supabase.
   * 
   * TO RE-ENABLE GOOGLE AUTH:
   * 1. Enable Google provider in Supabase Dashboard → Authentication → Providers
   * 2. Create OAuth 2.0 credentials in Google Cloud Console (separate from Gmail API credentials)
   * 3. Configure authorized redirect URIs in Google Cloud Console:
   *    - https://[your-project].supabase.co/auth/v1/callback
   * 4. Add credentials to Supabase provider configuration
   * 5. Uncomment this function and update the type definition above
   * 6. Uncomment Google auth buttons in AuthModal.tsx and login/page.tsx
   * 
   * The implementation below is functional and ready to use once backend is configured.
   */
  // const signInWithGoogle = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/auth/callback`,
  //     },
  //   });
  //   return { error };
  // };

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
    // GOOGLE AUTH TEMPORARILY DISABLED
    // signInWithGoogle,
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
  const { signUp, signIn, signOut, resetPassword, updateProfile, refreshSession /* signInWithGoogle */ } = useAuth();
  return { signUp, signIn, signOut, resetPassword, updateProfile, refreshSession /* signInWithGoogle */ };
}