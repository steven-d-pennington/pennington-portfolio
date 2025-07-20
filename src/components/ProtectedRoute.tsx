'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './AuthProvider';
import AuthModal from './AuthModal';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string[];
  fallback?: React.ReactNode;
  showModal?: boolean; // If true, shows auth modal instead of redirecting
  redirectTo?: string; // Where to redirect after login
};

export default function ProtectedRoute({ 
  children, 
  requiredRole = [], 
  fallback,
  showModal = false,
  redirectTo
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // If no user and we should show modal, show it
    if (!user && showModal) {
      setAuthModalOpen(true);
      return;
    }

    // If no user and we should redirect, redirect to home with auth required flag
    if (!user && !showModal) {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams();
      searchParams.set('authRequired', 'true');
      if (redirectTo || currentPath !== '/') {
        searchParams.set('redirectTo', redirectTo || currentPath);
      }
      router.push(`/?${searchParams.toString()}`);
      return;
    }

    // Check role requirements if user exists
    if (user && requiredRole.length > 0) {
      const userRole = userProfile?.role || 'user';
      const hasRequiredRole = requiredRole.includes(userRole);
      
      if (!hasRequiredRole) {
        router.push('/unauthorized');
        return;
      }
    }

    // Close modal if user is now authenticated
    if (user && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [user, userProfile, loading, router, showModal, redirectTo, requiredRole, authModalOpen]);

  // Show loading state
  if (loading) {
    return fallback || <LoadingState />;
  }

  // If no user and showing modal, show modal with fallback content
  if (!user && showModal) {
    return (
      <>
        {fallback || <AuthRequiredFallback onSignIn={() => setAuthModalOpen(true)} />}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode="login"
        />
      </>
    );
  }

  // Check role permissions
  if (user && requiredRole.length > 0) {
    const userRole = userProfile?.role || 'user';
    const hasRequiredRole = requiredRole.includes(userRole);
    
    if (!hasRequiredRole) {
      return <UnauthorizedAccess userRole={userRole} requiredRoles={requiredRole} />;
    }
  }

  // If user is authenticated and authorized, render children
  if (user) {
    return <>{children}</>;
  }

  // Fallback for redirect case (should not reach here due to useEffect)
  return fallback || <LoadingState />;
}

// Default loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
      </div>
    </div>
  );
}

// Default auth required fallback
function AuthRequiredFallback({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You need to sign in to access this content. Please sign in to continue.
        </p>
        <button
          onClick={onSignIn}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

// Unauthorized access component
function UnauthorizedAccess({ userRole, requiredRoles }: { userRole: string; requiredRoles: string[] }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          You don't have permission to access this content.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Your role: <span className="font-medium">{userRole}</span><br />
          Required: <span className="font-medium">{requiredRoles.join(', ')}</span>
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// Higher-order component version for easier use
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking auth status in components
export function useRequireAuth(requiredRole?: string[]) {
  const { user, userProfile, loading } = useUser();
  
  const isAuthenticated = !!user;
  const isAuthorized = requiredRole 
    ? requiredRole.includes(userProfile?.role || 'user') 
    : true;
  
  return {
    isAuthenticated,
    isAuthorized: isAuthenticated && isAuthorized,
    loading,
    user,
    userProfile
  };
}