'use client'

import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  className?: string
}

// Default icons for common scenarios
const DefaultIcons = {
  projects: (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  clients: (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  users: (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  files: (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  search: (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  data: (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            action.variant === 'secondary'
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// Specialized empty state components for common scenarios
interface ProjectsEmptyStateProps {
  onCreateProject: () => void
  className?: string
}

export function ProjectsEmptyState({ onCreateProject, className }: ProjectsEmptyStateProps) {
  return (
    <EmptyState
      icon={DefaultIcons.projects}
      title="No projects yet"
      description="Get started by creating your first project. You can add team members, track progress, and manage deadlines all in one place."
      action={{
        label: "Create First Project",
        onClick: onCreateProject
      }}
      className={className}
    />
  )
}

interface ClientsEmptyStateProps {
  onCreateClient: () => void
  className?: string
}

export function ClientsEmptyState({ onCreateClient, className }: ClientsEmptyStateProps) {
  return (
    <EmptyState
      icon={DefaultIcons.clients}
      title="No clients yet"
      description="Add your first client company to get started with project management and invoicing."
      action={{
        label: "Add First Client",
        onClick: onCreateClient
      }}
      className={className}
    />
  )
}

interface UsersEmptyStateProps {
  onInviteUser: () => void
  className?: string
}

export function UsersEmptyState({ onInviteUser, className }: UsersEmptyStateProps) {
  return (
    <EmptyState
      icon={DefaultIcons.users}
      title="No team members yet"
      description="Invite team members to collaborate on projects and share workloads effectively."
      action={{
        label: "Invite First User",
        onClick: onInviteUser
      }}
      className={className}
    />
  )
}

interface SearchEmptyStateProps {
  searchTerm: string
  onClearSearch: () => void
  className?: string
}

export function SearchEmptyState({ searchTerm, onClearSearch, className }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon={DefaultIcons.search}
      title="No results found"
      description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search or filters.`}
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "secondary"
      }}
      className={className}
    />
  )
}

interface FilesEmptyStateProps {
  onUploadFile?: () => void
  className?: string
}

export function FilesEmptyState({ onUploadFile, className }: FilesEmptyStateProps) {
  return (
    <EmptyState
      icon={DefaultIcons.files}
      title="No files uploaded"
      description="Share project files, documents, and assets with your team by uploading them here."
      action={onUploadFile ? {
        label: "Upload First File",
        onClick: onUploadFile
      } : undefined}
      className={className}
    />
  )
}