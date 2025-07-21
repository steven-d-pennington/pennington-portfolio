'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Toast } from './Toast';

function AuthErrorHandlerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    // Check for auth errors in URL
    const authError = searchParams.get('auth_error');
    const authSuccess = searchParams.get('auth_success');
    const message = searchParams.get('message');
    const authRequired = searchParams.get('authRequired');

    if (authError || authSuccess || authRequired) {
      let toastMessage = '';
      let toastType: 'success' | 'error' | 'warning' | 'info' = 'info';

      if (authSuccess) {
        switch (authSuccess) {
          case 'email_confirmed':
            toastMessage = '✅ Email confirmed successfully! You are now signed in.';
            toastType = 'success';
            break;
          case 'signed_out':
            toastMessage = 'You have been signed out successfully.';
            toastType = 'info';
            break;
          default:
            toastMessage = 'Authentication successful!';
            toastType = 'success';
        }
      } else if (authError) {
        switch (authError) {
          case 'expired_link':
            toastMessage = message || '⏰ Email confirmation link has expired. Please sign up again to get a new link.';
            toastType = 'error';
            break;
          case 'server_error':
            toastMessage = message || '🔧 Server error occurred. Please try again later.';
            toastType = 'error';
            break;
          case 'exchange_failed':
            toastMessage = message || '❌ Failed to confirm email. Please try signing up again.';
            toastType = 'error';
            break;
          case 'callback_error':
            toastMessage = message || '🔗 An error occurred during email confirmation.';
            toastType = 'error';
            break;
          default:
            toastMessage = message || 'Authentication error occurred. Please try again.';
            toastType = 'error';
        }
      } else if (authRequired) {
        toastMessage = '🔒 Please sign in to access that page.';
        toastType = 'warning';
      }

      if (toastMessage) {
        setToast({ message: toastMessage, type: toastType });
        
        // Clean up URL after showing the message
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('auth_error');
        newUrl.searchParams.delete('auth_success');
        newUrl.searchParams.delete('message');
        newUrl.searchParams.delete('authRequired');
        newUrl.searchParams.delete('redirectTo');
        
        // Use replace to avoid adding to history
        router.replace(newUrl.pathname + (newUrl.searchParams.toString() ? '?' + newUrl.searchParams.toString() : ''));
      }
    }
  }, [searchParams, router]);

  const closeToast = () => {
    setToast(null);
  };

  if (!toast) return null;

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      duration={7000} // Show longer for error messages
      onClose={closeToast}
    />
  );
}

export default function AuthErrorHandler() {
  return (
    <Suspense fallback={null}>
      <AuthErrorHandlerContent />
    </Suspense>
  );
}