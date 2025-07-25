'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/UnifiedAuthProvider'
import { supabase } from '@/utils/supabase'
import type { ProjectWithClient } from '@/types/database'

interface ProjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string | null
  onProjectUpdated: () => void
}

// Helper functions
const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

export default function ProjectDetailsModal({ isOpen, onClose, projectId, onProjectUpdated }: ProjectDetailsModalProps) {
  const { user, userProfile } = useUser()
  const [loading, setLoading] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [clients, setClients] = useState<Array<{id: string, company_name: string, status: string, primary_contact?: {full_name: string, email: string} | null}>>([])
  const [loadingClients, setLoadingClients] = useState(false)

  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectDetails()
      loadClients()
    }
  }, [isOpen, projectId])

  const loadClients = async () => {
    setLoadingClients(true)
    try {
      const response = await fetch('/api/client-companies')
      if (!response.ok) {
        throw new Error('Failed to fetch client companies')
      }
      
      const data = await response.json()
      setClients(data.companies || [])
    } catch (error) {
      console.error('Error loading client companies:', error)
    } finally {
      setLoadingClients(false)
    }
  }

  const loadProjectDetails = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      // Using singleton supabase client
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('No session')

      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load project')
      }

      const { project: projectData } = await response.json()
      setProject(projectData)
      setEditForm({
        name: projectData.name,
        description: projectData.description || '',
        client_id: projectData.client_id || '',
        status: projectData.status,
        github_repo_url: projectData.github_repo_url || '',
        estimated_hours: projectData.estimated_hours || '',
        hourly_rate: projectData.hourly_rate || '',
        fixed_price: projectData.fixed_price || '',
        start_date: projectData.start_date || '',
        end_date: projectData.end_date || ''
      })
    } catch (error) {
      console.error('Error loading project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!projectId) return

    setLoading(true)
    try {
      // Using singleton supabase client
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('No session')

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editForm,
          estimated_hours: editForm.estimated_hours ? parseInt(editForm.estimated_hours) : null,
          hourly_rate: editForm.hourly_rate ? parseFloat(editForm.hourly_rate) : null,
          fixed_price: editForm.fixed_price ? parseFloat(editForm.fixed_price) : null,
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update project')
      }

      setIsEditing(false)
      onProjectUpdated()
      onClose() // Close modal and return to projects dashboard
    } catch (error: any) {
      console.error('Error updating project:', error)
      alert(error.message || 'Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Project' : 'Project Details'}
          </h3>
          <div className="flex items-center space-x-2">
            {userProfile?.role === 'admin' && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : project ? (
          <div className="space-y-6">
            {/* Project Header */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-2xl font-bold w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
              )}
              
              <div className="mt-2 flex items-center space-x-4">
                {isEditing ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status || 'planning')}`}>
                    {project.status?.replace('_', ' ') || 'planning'}
                  </span>
                )}
                
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created {formatDate(project.created_at)}
                </span>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                  {isEditing ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">
                      {project.description || 'No description provided'}
                    </p>
                  )}
                </div>

                {/* Client Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client</h4>
                  {isEditing ? (
                    <select
                      value={editForm.client_id}
                      onChange={(e) => setEditForm({ ...editForm, client_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={loadingClients}
                    >
                      <option value="">Select a client...</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.company_name} {client.primary_contact && `(${client.primary_contact.full_name})`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {project.client_companies ? (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {project.client_companies.company_name}
                          </p>
                          {project.client_companies.industry && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {project.client_companies.industry}
                            </p>
                          )}
                          {project.client_companies.client_contacts && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Contact: {project.client_companies.client_contacts.full_name}
                            </p>
                          )}
                          {project.client_companies.client_contacts?.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {project.client_companies.client_contacts.email}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No client assigned</p>
                      )}
                    </div>
                  )}
                </div>

                {/* GitHub Integration */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub Repository</h4>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editForm.github_repo_url}
                      onChange={(e) => setEditForm({ ...editForm, github_repo_url: e.target.value })}
                      placeholder="https://github.com/user/repo"
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : project.github_repo_url ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      <a
                        href={project.github_repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {project.github_repo_name || project.github_repo_url}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No repository linked</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Start Date:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editForm.start_date}
                          onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                          className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">{formatDate(project.start_date)}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">End Date:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editForm.end_date}
                          onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                          className="text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">{formatDate(project.end_date)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Budget & Estimates */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget & Estimates</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Hours:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.estimated_hours}
                          onChange={(e) => setEditForm({ ...editForm, estimated_hours: e.target.value })}
                          className="text-sm border rounded px-2 py-1 w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.estimated_hours ? `${project.estimated_hours}h` : 'Not set'}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.hourly_rate}
                          onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                          className="text-sm border rounded px-2 py-1 w-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.hourly_rate ? formatCurrency(project.hourly_rate) : 'Not set'}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fixed Price:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.fixed_price}
                          onChange={(e) => setEditForm({ ...editForm, fixed_price: e.target.value })}
                          className="text-sm border rounded px-2 py-1 w-28 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.fixed_price ? formatCurrency(project.fixed_price) : 'Not set'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Members</h4>
                  {project.project_members && project.project_members.length > 0 ? (
                    <div className="space-y-2">
                      {project.project_members.map((member: any) => (
                        <div key={member.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                              {member.user_profiles?.full_name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {member.user_profiles?.full_name || member.user_profiles?.email}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No team members assigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {isEditing && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditForm({
                      name: project.name,
                      description: project.description || '',
                      client_id: project.client_id || '',
                      status: project.status,
                      github_repo_url: project.github_repo_url || '',
                      estimated_hours: project.estimated_hours || '',
                      hourly_rate: project.hourly_rate || '',
                      fixed_price: project.fixed_price || '',
                      start_date: project.start_date || '',
                      end_date: project.end_date || ''
                    })
                  }}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Failed to load project details</p>
          </div>
        )}
      </div>
    </div>
  )
}