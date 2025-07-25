'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import type { 
  UnifiedUser, 
  AuthSession, 
  AuthContextType, 
  UserType, 
  TeamRole, 
  ClientRole,
  RouteCategory 
} from '@/types/auth'
import { ROUTE_ACCESS } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function UnifiedAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UnifiedUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Determine user type and fetch appropriate profile
  const fetchUserProfile = useCallback(async (userId: string): Promise<UnifiedUser | null> => {
    try {
      const response = await fetch(`/api/auth/user-profile?userId=${userId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('User profile not found')
          return null
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const { user } = await response.json()
      return user
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession?.user) {
          const userProfile = await fetchUserProfile(currentSession.user.id)
          
          if (userProfile) {
            setUser(userProfile)
            setSession({
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
              expires_at: currentSession.expires_at || 0,
              user: userProfile
            })
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userProfile = await fetchUserProfile(session.user.id)
        if (userProfile) {
          setUser(userProfile)
          setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at || 0,
            user: userProfile
          })
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

  // Sign in function that auto-detects user type
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) return { error: error.message }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id)
        
        if (!userProfile) {
          await supabase.auth.signOut()
          return { error: 'User profile not found' }
        }

        // Auth state will be updated by the listener
        return {}
      }

      return { error: 'Authentication failed' }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign in failed' }
    }
  }, [fetchUserProfile])

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, options?: { data?: Record<string, unknown> }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      })

      if (error) return { error: error.message }
      
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign up failed' }
    }
  }, [])

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) return { error: error.message }
      
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password reset failed' }
    }
  }, [])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) return { error: error.message }
      
      setUser(null)
      setSession(null)
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' }
    }
  }, [])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) return { error: error.message }
      
      if (data.session?.user) {
        const userProfile = await fetchUserProfile(data.session.user.id)
        if (userProfile) {
          setUser(userProfile)
          setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at || 0,
            user: userProfile
          })
        }
      }
      
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Session refresh failed' }
    }
  }, [fetchUserProfile])

  // Update user profile
  const updateProfile = useCallback(async (updates: { full_name?: string; avatar_url?: string }) => {
    try {
      if (!user?.id) {
        throw new Error('No user logged in')
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      // Refresh the user data to get updated profile
      const updatedUserProfile = await fetchUserProfile(user.id)
      if (updatedUserProfile) {
        setUser(updatedUserProfile)
      }
      
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update profile' }
    }
  }, [user?.id, fetchUserProfile])

  // Helper functions
  const isTeamUser = useCallback(() => user?.userType === 'team', [user])
  const isClientUser = useCallback(() => user?.userType === 'client', [user])
  
  const hasRole = useCallback((role: TeamRole | ClientRole) => {
    return user?.role === role
  }, [user])

  const canAccess = useCallback((resource: string) => {
    if (!user) return false

    // Check public routes
    if (ROUTE_ACCESS.public.includes(resource as any)) return true

    // Check team routes
    if (user.userType === 'team') {
      if (ROUTE_ACCESS.team.some(route => resource.startsWith(route))) {
        // Check admin-only routes
        if (ROUTE_ACCESS.admin.some(route => resource.startsWith(route))) {
          return user.role === 'admin'
        }
        return true
      }
    }

    // Check client routes
    if (user.userType === 'client') {
      if (ROUTE_ACCESS.client.some(route => resource.startsWith(route))) {
        // Check client manager routes
        if (ROUTE_ACCESS.clientManager.some(route => resource.startsWith(route))) {
          return (user as any).can_manage_team || user.role === 'owner'
        }
        return true
      }
    }

    return false
  }, [user])

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    resetPassword,
    signOut,
    refreshSession,
    updateProfile,
    isTeamUser,
    isClientUser,
    hasRole,
    canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper hooks for backwards compatibility
export function useUser() {
  const { user, loading } = useAuth()
  return { user, userProfile: user, loading }
}

export function useSession() {
  const { session, loading } = useAuth()
  return { session, loading }
}

export function useAuthActions() {
  const { signIn, signUp, resetPassword, signOut, refreshSession, updateProfile } = useAuth()
  return { signIn, signUp, resetPassword, signOut, refreshSession, updateProfile }
}