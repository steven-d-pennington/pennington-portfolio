import { useState, useCallback } from 'react'
import { useApiError } from './useApiError'

interface UseAsyncOperationOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
  successMessage?: string
}

export function useAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)
  const { handleApiError } = useApiError()

  const execute = useCallback(async (operation: () => Promise<T>) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await operation()
      setData(result)
      
      if (options.onSuccess) {
        options.onSuccess()
      }
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed'
      setError(errorMessage)
      
      if (options.onError) {
        options.onError(err)
      } else {
        handleApiError(err)
      }
      
      throw err
    } finally {
      setLoading(false)
    }
  }, [options, handleApiError])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}