'use client'

import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import { useRouter } from 'next/navigation'

interface DashboardErrorBoundaryProps {
  children: React.ReactNode
}

export default function DashboardErrorBoundary({ children }: DashboardErrorBoundaryProps) {
  const router = useRouter()

  const handleError = (error: Error) => {
    // Log dashboard-specific errors
    console.error('Dashboard Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })
  }

  const dashboardFallback = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
          Dashboard Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          There was an error loading the dashboard. This might be due to a data issue or network problem.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Reload Dashboard
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <ErrorBoundary fallback={dashboardFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}