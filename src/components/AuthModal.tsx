'use client';

import React, { useState } from 'react';
import { useAuthActions } from './AuthProvider';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
};

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signUp, signIn, resetPassword /* signInWithGoogle */ } = useAuthActions();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError(null);
    setMessage(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        const { error } = await signUp(email, password, {
          data: {
            full_name: fullName,
          }
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the confirmation link!');
          setTimeout(() => handleClose(), 2000);
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);

        if (error) {
          setError(error.message);
        } else {
          handleClose();
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);

        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the password reset link!');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    setError(null);
    setMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'signup' && 'Create Account'}
              {mode === 'login' && 'Sign In'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your password"
                />
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Error and Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : (
                <>
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'login' && 'Sign In'}
                  {mode === 'reset' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* GOOGLE AUTH TEMPORARILY DISABLED - 2025-01-24
           * 
           * Google OAuth button was disabled because provider is not configured in Supabase.
           * 
           * TO RE-ENABLE: Uncomment the sections below after configuring Google OAuth in Supabase.
           * See AuthProvider.tsx for detailed re-enabling instructions.
           */}

          {/* OR Divider */}
          {/* <div className="relative flex justify-center text-sm my-6">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
            <div className="absolute inset-y-0 left-0 w-full border-t border-gray-200 dark:border-gray-700" aria-hidden="true"></div>
          </div> */}

          {/* Social Login Options */}
          {/* <button
            onClick={signInWithGoogle}
            className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center space-x-2"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2045C17.64 8.5645 17.58 7.9545 17.47 7.3745H9V10.3745H13.89C13.71 11.3545 13.14 12.1845 12.32 12.7445V14.7445H14.87C16.31 13.4045 17.18 11.4045 17.64 9.2045Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.46 17.19 14.87 15.82L12.32 13.74C11.65 14.2045 10.83 14.5045 9 14.5045C7.31 14.5045 5.84 13.4045 5.27 11.8345L2.61 13.8345H5.27C6.68 16.5045 9.68 18 12.68 18H9Z" fill="#34A853"/>
              <path d="M2.61 10.7545L5.27 8.7545C5.14 8.3945 5.06 8.0045 5.06 7.5945C5.06 7.1845 5.14 6.7945 5.27 6.4345L2.61 4.4345H2.61C0.98 7.1045 0.98 10.8945 2.61 13.5645L2.61 10.7545Z" fill="#FBBC05"/>
              <path d="M9 3.5C10.25 3.5 11.36 3.92 12.24 4.76L14.9 2.09C13.46 0.76 11.43 0 9 0C5.9 0 3.2 1.81 2.61 4.4345L5.27 6.4345C5.84 4.8645 7.31 3.5 9 3.5Z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </button> */}

          {/* Mode Switching */}
          <div className="mt-6 text-center text-sm">
            {mode === 'login' && (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Forgot your password?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Reset it
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <p className="text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}