'use client';

import { useAuthActions, useSession } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { signInWithGoogle } = useAuthActions();
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      // Redirect to home page after successful login
      router.push('/');
    }
  }, [session, loading, router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f2f5',
      color: '#333'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2em',
          marginBottom: '20px',
          color: '#333'
        }}>Login</h1>
        <p style={{
          marginBottom: '30px',
          color: '#666'
        }}>Sign in to access your personalized content.</p>
        <button
          onClick={signInWithGoogle}
          style={{
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '5px',
            fontSize: '1em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ae8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4285F4')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2045C17.64 8.5645 17.58 7.9545 17.47 7.3745H9V10.3745H13.89C13.71 11.3545 13.14 12.1845 12.32 12.7445V14.7445H14.87C16.31 13.4045 17.18 11.4045 17.64 9.2045Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.46 17.19 14.87 15.82L12.32 13.74C11.65 14.2045 10.83 14.5045 9 14.5045C7.31 14.5045 5.84 13.4045 5.27 11.8345L2.61 13.8345H5.27C6.68 16.5045 9.68 18 12.68 18H9Z" fill="#34A853"/>
            <path d="M2.61 10.7545L5.27 8.7545C5.14 8.3945 5.06 8.0045 5.06 7.5945C5.06 7.1845 5.14 6.7945 5.27 6.4345L2.61 4.4345H2.61C0.98 7.1045 0.98 10.8945 2.61 13.5645L2.61 10.7545Z" fill="#FBBC05"/>
            <path d="M9 3.5C10.25 3.5 11.36 3.92 12.24 4.76L14.9 2.09C13.46 0.76 11.43 0 9 0C5.9 0 3.2 1.81 2.61 4.4345L5.27 6.4345C5.84 4.8645 7.31 3.5 9 3.5Z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
