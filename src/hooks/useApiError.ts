import { useCallback } from 'react'
import { useToast } from '@/components/ToastProvider'

interface ApiError {
  message: string
  details?: string
  status?: number
}

export function useApiError() {
  const { showError } = useToast()

  const handleApiError = useCallback((error: unknown, defaultMessage = 'An unexpected error occurred') => {
    let errorMessage = defaultMessage
    let errorDetails: string | undefined

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      const apiError = error as ApiError
      if (apiError.message) {
        errorMessage = apiError.message
      }
      if (apiError.details) {
        errorDetails = apiError.details
      }
    }

    // Show user-friendly error messages
    showError(errorMessage, errorDetails)

    // Log detailed error for debugging
    console.error('API Error:', {
      originalError: error,
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })
  }, [showError])

  const handleFormError = useCallback((error: unknown, fieldName?: string) => {
    let errorMessage = 'Please check your input and try again'
    
    if (error instanceof Error) {
      if (error.message.includes('validation') || error.message.includes('required')) {
        errorMessage = fieldName ? `${fieldName} is required` : 'Please fill in all required fields'
      } else if (error.message.includes('duplicate') || error.message.includes('exists')) {
        errorMessage = 'This value already exists'
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Please enter a valid value'
      } else {
        errorMessage = error.message
      }
    }

    showError('Form Error', errorMessage)
  }, [showError])

  const handleNetworkError = useCallback(() => {
    showError(
      'Network Error',
      'Please check your internet connection and try again'
    )
  }, [showError])

  const handleAuthError = useCallback(() => {
    showError(
      'Authentication Error',
      'Please sign in again to continue'
    )
  }, [showError])

  return {
    handleApiError,
    handleFormError,
    handleNetworkError,
    handleAuthError
  }
}