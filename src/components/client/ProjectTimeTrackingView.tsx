'use client'

import { useState } from 'react'

interface TimeEntry {
  id: string
  date: string
  hours: number
  description: string
  task_category: string
  team_member: string
  team_member_role: string
  hourly_rate: number
  is_billable: boolean
  is_billed: boolean
}

interface ProjectTimeTrackingViewProps {
  projectId: string
  timeEntries: TimeEntry[]
  estimatedHours?: number
  budgetType: 'hourly' | 'fixed'
  budget?: number
}

export default function ProjectTimeTrackingView({ 
  projectId, 
  timeEntries, 
  estimatedHours, 
  budgetType,
  budget 
}: ProjectTimeTrackingViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')
  const [groupBy, setGroupBy] = useState<'date' | 'member' | 'category'>('date')

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    if (minutes === 0) return `${wholeHours}h`
    return `${wholeHours}h ${minutes}m`
  }

  // Calculate totals
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const billableHours = timeEntries.filter(entry => entry.is_billable).reduce((sum, entry) => sum + entry.hours, 0)
  const totalValue = timeEntries.filter(entry => entry.is_billable).reduce((sum, entry) => sum + (entry.hours * entry.hourly_rate), 0)
  const billedValue = timeEntries.filter(entry => entry.is_billable && entry.is_billed).reduce((sum, entry) => sum + (entry.hours * entry.hourly_rate), 0)

  const progressPercentage = estimatedHours ? Math.min((totalHours / estimatedHours) * 100, 100) : 0

  // Group entries based on selection
  const groupedEntries = timeEntries.reduce((groups: any, entry) => {
    let key: string
    switch (groupBy) {
      case 'member':
        key = entry.team_member
        break
      case 'category':
        key = entry.task_category
        break
      default:
        key = entry.date
    }
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(entry)
    return groups
  }, {})

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'design': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'testing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'meeting': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'documentation': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'deployment': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatHours(totalHours)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Billable</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatHours(billableHours)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Billed</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(billedValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {estimatedHours && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Project Progress</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatHours(totalHours)} / {formatHours(estimatedHours)} ({Math.round(progressPercentage)}%)
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                progressPercentage > 100 
                  ? 'bg-red-500' 
                  : progressPercentage > 80 
                    ? 'bg-yellow-500' 
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          {progressPercentage > 100 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              ⚠️ Project has exceeded estimated hours by {formatHours(totalHours - estimatedHours)}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Time Tracking Details
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {timeEntries.length} time entr{timeEntries.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Group by:</span>
            {[
              { id: 'date', label: 'Date' },
              { id: 'member', label: 'Member' },
              { id: 'category', label: 'Category' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setGroupBy(option.id as any)}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  groupBy === option.id
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Entries */}
      {timeEntries.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No time entries</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Time tracking data will appear here as work progresses on your project.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([groupKey, entries]: [string, any]) => {
            const groupTotal = entries.reduce((sum: number, entry: TimeEntry) => sum + entry.hours, 0)
            const groupBillable = entries.filter((entry: TimeEntry) => entry.is_billable).reduce((sum: number, entry: TimeEntry) => sum + entry.hours, 0)
            
            return (
              <div key={groupKey} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {groupBy === 'date' ? formatDate(groupKey) : groupKey}
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatHours(groupTotal)} total</span>
                      <span>{formatHours(groupBillable)} billable</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {entries.map((entry: TimeEntry) => (
                    <div key={entry.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(entry.task_category)}`}>
                              {entry.task_category}
                            </span>
                            {entry.is_billable && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Billable
                              </span>
                            )}
                            {entry.is_billed && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Billed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {entry.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{entry.team_member} • {entry.team_member_role}</span>
                            {groupBy !== 'date' && <span>{formatDate(entry.date)}</span>}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatHours(entry.hours)}
                          </p>
                          {entry.is_billable && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatCurrency(entry.hours * entry.hourly_rate)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}