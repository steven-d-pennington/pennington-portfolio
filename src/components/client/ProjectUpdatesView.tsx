'use client'

import { useState, useEffect } from 'react'

interface ProjectUpdate {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'milestone'
  author: string
  author_role: string
  created_at: string
  is_read: boolean
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

interface ProjectUpdatesViewProps {
  projectId: string
  updates: ProjectUpdate[]
  onMarkAsRead?: (updateId: string) => void
}

export default function ProjectUpdatesView({ projectId, updates, onMarkAsRead }: ProjectUpdatesViewProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'milestones'>('all')

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'milestone':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const filteredUpdates = updates.filter(update => {
    if (filter === 'unread') return !update.is_read
    if (filter === 'milestones') return update.type === 'milestone'
    return true
  })

  const handleMarkAsRead = (updateId: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(updateId)
    }
  }

  const unreadCount = updates.filter(u => !u.is_read).length

  return (
    <div>
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Project Updates
          </h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {unreadCount} unread update{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {[
            { id: 'all', label: 'All', count: updates.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'milestones', label: 'Milestones', count: updates.filter(u => u.type === 'milestone').length }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span className="ml-1 text-xs">({filterOption.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Updates List */}
      {filteredUpdates.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No updates</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filter === 'unread' 
              ? 'All updates have been read'
              : filter === 'milestones'
              ? 'No milestone updates yet'
              : 'No project updates available'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <div
              key={update.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-sm ${
                update.is_read
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10'
              }`}
            >
              <div className="flex space-x-3">
                {getUpdateIcon(update.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${
                        update.is_read
                          ? 'text-gray-900 dark:text-white'
                          : 'text-blue-900 dark:text-blue-100'
                      }`}>
                        {update.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        update.is_read
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'text-blue-800 dark:text-blue-200'
                      }`}>
                        {update.message}
                      </p>
                      
                      {/* Attachments */}
                      {update.attachments && update.attachments.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {update.attachments.map((attachment, idx) => (
                            <a
                              key={idx}
                              href={attachment.url}
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              {attachment.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <time className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(update.created_at)}
                      </time>
                      {!update.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(update.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Author info */}
                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{update.author}</span>
                    <span className="mx-1">•</span>
                    <span className="capitalize">{update.author_role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live updates indicator */}
      <div className="mt-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live updates enabled</span>
        </div>
      </div>
    </div>
  )
}