'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/AuthProvider'
import { supabase } from '@/utils/supabase'

export default function DebugUserRolePage() {
  const { user, userProfile, loading: authLoading } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile()
    }
  }, [user?.id])

  const fetchUserProfile = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setMessage('No valid session found')
        return
      }

      const response = await fetch(`/api/debug/user-role?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch profile')
      }

      const { profile: fetchedProfile } = await response.json()
      setProfile(fetchedProfile)
      setSelectedRole(fetchedProfile.role || 'user')
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async () => {
    if (!user?.id || !selectedRole) return

    setUpdating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setMessage('No valid session found')
        return
      }

      const response = await fetch(`/api/debug/user-role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          role: selectedRole
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update role')
      }

      const { profile: updatedProfile, message: successMessage } = await response.json()
      setProfile(updatedProfile)
      setMessage(successMessage)
      
      // Refresh the page to update the auth context
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
    } catch (error: any) {
      console.error('Error updating role:', error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const createProfile = async () => {
    if (!user?.id || !user?.email) return

    setCreating(true)
    try {
      // Try to create the profile directly using the client
      const { data: newProfile, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: userProfile?.full_name || null,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        // If that fails, check if it's because the profile already exists
        if (error.code === '23505') { // Unique constraint violation
          // Profile exists, try to fetch it
          const { data: existingProfile, error: fetchError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (fetchError) {
            throw new Error(`Profile exists but can't fetch it: ${fetchError.message}`)
          }

          setProfile(existingProfile)
          setSelectedRole(existingProfile.role || 'admin')
          setMessage('Profile already exists! Found existing profile.')
        } else {
          throw new Error(`Database error: ${error.message}`)
        }
      } else {
        setProfile(newProfile)
        setSelectedRole(newProfile.role || 'admin')
        setMessage('Profile created successfully!')
      }
      
      // Refresh the auth context
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
    } catch (error: any) {
      console.error('Error creating profile:', error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setCreating(false)
    }
  }

  if (authLoading) {
    return <div className="p-8">Loading authentication...</div>
  }

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug User Role</h1>
        <p className="text-red-600">Please sign in first.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Debug User Role</h1>

          {message && (
            <div className={`p-3 rounded mb-4 ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Current User Info</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Auth Provider:</strong> {user.app_metadata?.provider || 'email'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Profile from AuthProvider</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                {userProfile ? (
                  <div>
                    <p><strong>Role:</strong> {userProfile.role || 'null'}</p>
                    <p><strong>Full Name:</strong> {userProfile.full_name || 'null'}</p>
                    <p><strong>Created:</strong> {userProfile.created_at}</p>
                  </div>
                ) : (
                  <p className="text-red-600">No profile found in AuthProvider</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Profile from Database
                <button 
                  onClick={fetchUserProfile}
                  disabled={loading}
                  className="ml-2 text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                {profile ? (
                  <div>
                    <p><strong>Role:</strong> {profile.role || 'null'}</p>
                    <p><strong>Full Name:</strong> {profile.full_name || 'null'}</p>
                    <p><strong>Company:</strong> {profile.company_name || 'null'}</p>
                    <p><strong>Created:</strong> {profile.created_at}</p>
                    <p><strong>Updated:</strong> {profile.updated_at}</p>
                  </div>
                ) : loading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <p className="text-red-600 mb-3">No profile found or failed to load</p>
                    <button 
                      onClick={createProfile}
                      disabled={creating}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {creating ? 'Creating Profile...' : 'Create Database Profile'}
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      This will create your profile in the database with admin role
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Update Role</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="user">user (default)</option>
                  <option value="client">client (can access dashboard)</option>
                  <option value="admin">admin (full access)</option>
                  <option value="team_member">team_member (can access dashboard)</option>
                  <option value="moderator">moderator</option>
                </select>
                <button 
                  onClick={updateRole}
                  disabled={updating || !selectedRole}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Role'}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Dashboard access requires: client, admin, or team_member role
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Test Dashboard Access</h2>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Account Dashboard
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard/projects'}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Project Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}