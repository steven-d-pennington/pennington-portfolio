'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/AuthProvider'
import ProtectedRoute from '@/components/ProtectedRoute'
import { createSupabaseBrowser } from '@/utils/supabase'
import CreateProjectModal from '@/components/dashboard/CreateProjectModal'
import ProjectDetailsModal from '@/components/dashboard/ProjectDetailsModal'
import QuickStatsCard from '@/components/dashboard/QuickStatsCard'
import type { ProjectWithClient } from '@/types/database'

// Helper functions for formatting
const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

const formatHours = (hours: number) => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours % 1) * 60)
  
  if (minutes === 0) {
    return `${wholeHours}h`
  }
  return `${wholeHours}h ${minutes}m`
}

function ProjectsDashboardPage() {
  const { user, userProfile } = useUser()
  const [projects, setProjects] = useState<ProjectWithClient[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalHoursWorked: 0,
    outstandingInvoices: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    if (user && userProfile) {
      loadDashboardData()
    }
  }, [user, userProfile])

  const loadDashboardData = async () => {
    if (!user?.id || !userProfile) {
      console.log('Missing user or userProfile:', { user: !!user, userProfile: !!userProfile })
      return
    }

    try {
      setLoading(true)
      
      // Check if user has access to project dashboard
      if (!userProfile.role || !['client', 'admin', 'team_member'].includes(userProfile.role)) {
        setError(`You do not have permission to access the project dashboard. Your role: ${userProfile.role}`)
        return
      }

      const isAdmin = userProfile.role === 'admin'
      
      // Try multiple methods to get a valid session
      let session = null
      let sessionError = null
      
      // Create browser client for this request
      const supabase = createSupabaseBrowser()
      
      // Method 1: Get current session
      const { data: { session: currentSession }, error: currentError } = await supabase.auth.getSession()
      if (currentSession?.access_token) {
        session = currentSession
      } else {
        console.log('No current session, trying refresh...', currentError)
        
        // Method 2: Try to refresh session
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
        if (refreshedSession?.access_token) {
          session = refreshedSession
          console.log('Session refreshed successfully')
        } else {
          sessionError = refreshError || currentError
        }
      }
      
      if (!session?.access_token) {
        console.error('No valid session found after refresh attempts:', sessionError)
        setError('Your session has expired. Please sign out and sign back in.')
        return
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }

      // Load projects
      const projectsResponse = await fetch(`/api/projects?userId=${user.id}&isAdmin=${isAdmin}`, {
        headers
      })
      
      if (!projectsResponse.ok) {
        throw new Error(`Failed to fetch projects: ${projectsResponse.statusText}`)
      }
      
      const { projects: userProjects } = await projectsResponse.json()
      setProjects(userProjects)

      // Load dashboard stats
      const statsResponse = await fetch(`/api/dashboard/stats?userId=${user.id}&isAdmin=${isAdmin}`, {
        headers
      })
      
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`)
      }
      
      const { stats: dashStats } = await statsResponse.json()
      setStats(dashStats)

    } catch (err: unknown) {
      console.error('Failed to load dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg shadow-lg">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {error.includes('sign in') ? 'Authentication Required' : 'Access Denied'}
            </h1>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <div className="flex space-x-3 justify-center">
              {(error.includes('sign in') || error.includes('session')) ? (
                <>
                  <button 
                    onClick={async () => {
                      const supabase = createSupabaseBrowser()
                      await supabase.auth.signOut()
                      window.location.href = '/login'
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Sign Out & Sign In
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => window.history.back()}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
              )}
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Project Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your projects, time, and invoices
              </p>
            </div>
            {userProfile?.role === 'admin' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Project
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStatsCard
            title="Total Projects"
            value={stats.totalProjects}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          
          <QuickStatsCard
            title="Active Projects"
            value={stats.activeProjects}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <QuickStatsCard
            title="Hours Worked"
            value={formatHours(stats.totalHoursWorked)}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <QuickStatsCard
            title="Outstanding Invoices"
            value={stats.outstandingInvoices}
            color="yellow"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
        </div>

        {/* Projects List */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Projects</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="max-w-md mx-auto">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {userProfile?.role === 'admin' ? 
                    "Get started by creating your first project." :
                    "You haven't been assigned to any projects yet."
                  }
                </p>
                {userProfile?.role === 'admin' && (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <div key={project.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status || 'planning')}`}>
                          {project.status?.replace('_', ' ') || 'planning'}
                        </span>
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        {project.github_repo_name && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
                            {project.github_repo_name}
                          </div>
                        )}
                        
                        {project.hourly_rate && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            {formatCurrency(project.hourly_rate)}/hr
                          </div>
                        )}
                        
                        {project.start_date && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Started {new Date(project.start_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => {
                          setSelectedProjectId(project.id)
                          setShowDetailsModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {(userProfile?.role === 'admin' || userProfile?.role === 'team_member') && (
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateProjectModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={loadDashboardData}
        />

        <ProjectDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedProjectId(null)
          }}
          projectId={selectedProjectId}
          onProjectUpdated={loadDashboardData}
        />
      </div>
    </div>
  )
}

export default function ProjectsDashboard() {
  return (
    <ProtectedRoute requiredRole={['client', 'admin', 'team_member']}>
      <ProjectsDashboardPage />
    </ProtectedRoute>
  )
}