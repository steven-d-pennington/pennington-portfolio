'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useToast } from '@/components/ToastProvider'
import FormField from '@/components/FormField'
import { InlineLoading } from '@/components/LoadingSpinner'

export default function ClientForgotPassword() {
  const { showSuccess, showError } = useToast()
  const [email, setEmail] = useState('')
  
  const { loading, execute: resetPassword } = useAsyncOperation({
    onSuccess: () => {
      showSuccess('Password reset email sent!', 'Check your email for reset instructions.')
      setEmail('')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await resetPassword(async () => {
      // TODO: Implement actual password reset API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType: 'client' })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send reset email')
      }
      
      return await response.json()
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Your Client Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your client portal email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormField
            label="Client Email Address"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            placeholder="your.email@clientcompany.com"
            validation={{
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }}
          />

          <div>
            <button
              type="submit"
              disabled={loading || !email}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <InlineLoading />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/client/login" 
              className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
            >
              Back to Client Portal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}