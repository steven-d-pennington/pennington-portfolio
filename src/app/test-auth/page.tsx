'use client'

import { useUser } from '@/components/AuthProvider'
import { supabase } from '@/utils/supabase'
import { useState } from 'react'

export default function TestAuthPage() {
  const { user, userProfile, loading } = useUser()
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const testAuthAPI = async () => {
    if (!user?.id) return

    setTestLoading(true)
    try {
      // Using singleton supabase client
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session)

      if (!session?.access_token) {
        setTestResult({ error: 'No session found' })
        return
      }

      const response = await fetch(`/api/test-auth?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error: any) {
      setTestResult({ error: error.message })
    } finally {
      setTestLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
        <p className="text-red-600">Not signed in</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">User from Auth Context</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            app_metadata: user.app_metadata
          }, null, 2)}</pre>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">User Profile from Auth Context</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(userProfile, null, 2)}</pre>
        </div>

        <div>
          <button 
            onClick={testAuthAPI}
            disabled={testLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {testLoading ? 'Testing...' : 'Test API Authentication'}
          </button>
        </div>

        {testResult && (
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">API Test Result</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}

        <div className="pt-4 border-t">
          <h2 className="font-bold mb-2">Quick Links</h2>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/debug/user-role'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Debug User Role
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/projects'}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Try Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}