'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './UnifiedAuthProvider'
import { FullPageLoading } from './LoadingSpinner'

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading, canAccess } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return // Wait for auth to initialize

    // Define route patterns and their requirements
    const routePatterns = [
      // Team routes
      { pattern: /^\/dashboard/, requiresAuth: true, userType: 'team', redirectTo: '/team/login' },
      { pattern: /^\/team\//, requiresAuth: false, userType: null, redirectTo: null },
      
      // Client routes  
      { pattern: /^\/client\/portal/, requiresAuth: true, userType: 'client', redirectTo: '/client/login' },
      { pattern: /^\/client-dashboard/, requiresAuth: true, userType: 'client', redirectTo: '/client/login' },
      { pattern: /^\/client\//, requiresAuth: false, userType: null, redirectTo: null },
      
      // Public routes
      { pattern: /^\/$/, requiresAuth: false, userType: null, redirectTo: null },
      { pattern: /^\/(about|contact|services|case-studies)/, requiresAuth: false, userType: null, redirectTo: null },
    ]

    // Find matching route pattern
    const matchedRoute = routePatterns.find(route => route.pattern.test(pathname))
    
    if (!matchedRoute) {
      // Unknown route, redirect to home
      router.replace('/')
      return
    }

    // Handle authentication requirements
    if (matchedRoute.requiresAuth) {
      if (!user) {
        // Not authenticated, redirect to appropriate login
        router.replace(matchedRoute.redirectTo!)
        return
      }

      // Check user type matches route requirements
      if (matchedRoute.userType && user.userType !== matchedRoute.userType) {
        // Wrong user type, redirect to appropriate dashboard
        if (user.userType === 'team') {
          router.replace('/dashboard')
        } else {
          router.replace('/client/portal')
        }
        return
      }

      // Check specific route permissions
      if (!canAccess(pathname)) {
        // User doesn't have permission, redirect to their dashboard
        if (user.userType === 'team') {
          router.replace('/dashboard')
        } else {
          router.replace('/client/portal')
        }
        return
      }
    } else {
      // Route doesn't require auth, but redirect authenticated users to appropriate dashboard
      if (user && (pathname === '/team/login' || pathname === '/client/login')) {
        if (user.userType === 'team') {
          router.replace('/dashboard')
        } else {
          router.replace('/client/portal')
        }
        return
      }
    }
  }, [user, loading, pathname, router, canAccess])

  // Show loading while determining route access
  if (loading) {
    return <FullPageLoading text="Checking authentication..." />
  }

  return <>{children}</>
}

export default RouteGuard