'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useClientAuth } from '@/components/ClientAuthProvider'
import ProjectTimelineView from '@/components/client/ProjectTimelineView'
import ProjectFilesView from '@/components/client/ProjectFilesView'
import ProjectUpdatesView from '@/components/client/ProjectUpdatesView'
import ProjectInvoicesView from '@/components/client/ProjectInvoicesView'
import ProjectTimeTrackingView from '@/components/client/ProjectTimeTrackingView'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  start_date: string | null
  end_date: string | null
  estimated_hours: number | null
  hourly_rate: number | null
  fixed_price: number | null
  github_repo_url: string | null
  created_at: string
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: 'milestone' | 'update' | 'delivery' | 'meeting'
  status: 'completed' | 'in_progress' | 'upcoming'
}

interface ProjectFile {
  id: string
  name: string
  size: number
  type: string
  uploaded_by: string
  uploaded_at: string
  download_url: string
  description?: string
}

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

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  paid_date?: string
  description: string
  line_items: {
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
  payment_method?: string
  notes?: string
}

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

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { session } = useClientAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [activeTab, setActiveTab] = useState<'timeline' | 'files' | 'updates' | 'invoices' | 'time'>('timeline')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session && params.id) {
      loadProject()
    }
  }, [session, params.id])

  const loadProject = async () => {
    if (!session || !params.id) return

    try {
      setLoading(true)
      setError(null)

      // Get project details
      const projectResponse = await fetch(`/api/client/projects/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      })

      if (!projectResponse.ok) {
        if (projectResponse.status === 404) {
          router.push('/client-dashboard')
          return
        }
        throw new Error('Failed to load project')
      }

      const { project: projectData } = await projectResponse.json()
      setProject(projectData)

      // Mock timeline events for now - in real implementation, these would come from API
      const mockEvents: TimelineEvent[] = [
        {
          id: '1',
          title: 'Project Kickoff',
          description: 'Initial project planning and requirements gathering session',
          date: projectData.created_at,
          type: 'meeting',
          status: 'completed'
        },
        {
          id: '2',
          title: 'Design Phase Complete',
          description: 'UI/UX designs approved and ready for development',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'milestone',
          status: 'completed'
        },
        {
          id: '3',
          title: 'Development Sprint 1',
          description: 'Core functionality implementation in progress',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'update',
          status: 'in_progress'
        },
        {
          id: '4',
          title: 'Beta Release',
          description: 'First version ready for client testing',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'delivery',
          status: 'upcoming'
        }
      ]

      setTimelineEvents(mockEvents)

      // Mock project files for now - in real implementation, these would come from API
      const mockFiles: ProjectFile[] = [
        {
          id: '1',
          name: 'Project Requirements.pdf',
          size: 2048576, // 2MB
          type: 'application/pdf',
          uploaded_by: 'John Smith (Project Manager)',
          uploaded_at: projectData.created_at,
          download_url: '#',
          description: 'Initial project requirements and specifications'
        },
        {
          id: '2',
          name: 'UI Mockups.figma',
          size: 15728640, // 15MB
          type: 'application/figma',
          uploaded_by: 'Sarah Designer',
          uploaded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          download_url: '#',
          description: 'User interface design mockups and prototypes'
        },
        {
          id: '3',
          name: 'Database Schema.png',
          size: 524288, // 512KB
          type: 'image/png',
          uploaded_by: 'Mike Developer',
          uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          download_url: '#',
          description: 'Database architecture diagram'
        }
      ]

      setProjectFiles(mockFiles)

      // Mock project updates
      const mockUpdates: ProjectUpdate[] = [
        {
          id: '1',
          title: 'Development Sprint 1 Complete',
          message: 'We have successfully completed the first development sprint. All core features are now implemented and ready for testing.',
          type: 'success',
          author: 'John Smith',
          author_role: 'Project Manager',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          is_read: false,
          attachments: [
            {
              name: 'Sprint_1_Demo.mp4',
              url: '#',
              type: 'video/mp4'
            }
          ]
        },
        {
          id: '2',
          title: 'Design Review Scheduled',
          message: 'We have scheduled a design review meeting for tomorrow at 2 PM EST to discuss the UI improvements.',
          type: 'info',
          author: 'Sarah Designer',
          author_role: 'Lead Designer',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          is_read: true
        },
        {
          id: '3',
          title: 'Milestone: Beta Release Ready',
          message: 'The beta version of your application is now ready for client testing. All requested features have been implemented.',
          type: 'milestone',
          author: 'Mike Developer',
          author_role: 'Lead Developer',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          is_read: true
        }
      ]

      setProjectUpdates(mockUpdates)

      // Mock invoices
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoice_number: 'INV-2024-001',
          amount: 8000,
          tax_amount: 800,
          total_amount: 8800,
          currency: 'USD',
          status: 'paid',
          issue_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          paid_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Development Phase 1 - Core Features',
          payment_method: 'Bank Transfer',
          line_items: [
            {
              description: 'Frontend Development (80 hours)',
              quantity: 80,
              rate: 75,
              amount: 6000
            },
            {
              description: 'Backend API Development (40 hours)',
              quantity: 40,
              rate: 100,
              amount: 4000
            }
          ]
        },
        {
          id: '2',
          invoice_number: 'INV-2024-002',
          amount: 4500,
          tax_amount: 450,
          total_amount: 4950,
          currency: 'USD',
          status: 'sent',
          issue_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Development Phase 2 - Advanced Features',
          line_items: [
            {
              description: 'Feature Development (45 hours)',
              quantity: 45,
              rate: 100,
              amount: 4500
            }
          ]
        }
      ]

      setInvoices(mockInvoices)

      // Mock time entries
      const mockTimeEntries: TimeEntry[] = [
        {
          id: '1',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          hours: 8,
          description: 'Implemented user authentication system',
          task_category: 'development',
          team_member: 'Mike Developer',
          team_member_role: 'Lead Developer',
          hourly_rate: 100,
          is_billable: true,
          is_billed: false
        },
        {
          id: '2',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          hours: 4,
          description: 'Designed user interface mockups',
          task_category: 'design',
          team_member: 'Sarah Designer',
          team_member_role: 'Lead Designer',
          hourly_rate: 85,
          is_billable: true,
          is_billed: false
        },
        {
          id: '3',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          hours: 6,
          description: 'Project planning and requirements review',
          task_category: 'meeting',
          team_member: 'John Smith',
          team_member_role: 'Project Manager',
          hourly_rate: 120,
          is_billable: true,
          is_billed: true
        },
        {
          id: '4',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          hours: 5,
          description: 'Unit testing for core modules',
          task_category: 'testing',
          team_member: 'Alex Tester',
          team_member_role: 'QA Engineer',
          hourly_rate: 75,
          is_billable: true,
          is_billed: true
        }
      ]

      setTimeEntries(mockTimeEntries)

    } catch (error: any) {
      console.error('Error loading project:', error)
      setError(error.message || 'Failed to load project')
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error || 'Project not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <div>
              <Link href="/client-dashboard" className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="sr-only">Dashboard</span>
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/client-dashboard" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Projects
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-900 dark:text-white" aria-current="page">
                {project.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status || 'planning')}`}>
                  {(project.status || 'planning').replace('_', ' ')}
                </span>
              </div>
              {project.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              )}
            </div>
            {project.github_repo_url && (
              <a
                href={project.github_repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                View Repository
              </a>
            )}
          </div>

          {/* Project Details Grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(project.start_date)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(project.end_date)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Hours</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {project.estimated_hours ? `${project.estimated_hours}h` : 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {project.fixed_price 
                  ? formatCurrency(project.fixed_price)
                  : project.hourly_rate 
                    ? `${formatCurrency(project.hourly_rate)}/hr`
                    : 'Not set'
                }
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'timeline', name: 'Timeline', icon: '📅' },
              { id: 'updates', name: 'Updates', icon: '📢', badge: projectUpdates.filter(u => !u.is_read).length },
              { id: 'files', name: 'Files', icon: '📁' },
              { id: 'invoices', name: 'Invoices', icon: '💰' },
              { id: 'time', name: 'Time Tracking', icon: '⏱️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-0">
          {activeTab === 'timeline' && (
            <div className="p-6">
              <ProjectTimelineView 
                projectId={project.id}
                projectName={project.name}
                events={timelineEvents}
              />
            </div>
          )}
          
          {activeTab === 'updates' && (
            <div className="p-6">
              <ProjectUpdatesView 
                projectId={project.id}
                updates={projectUpdates}
                onMarkAsRead={(updateId) => {
                  setProjectUpdates(prev => 
                    prev.map(update => 
                      update.id === updateId 
                        ? { ...update, is_read: true }
                        : update
                    )
                  )
                }}
              />
            </div>
          )}
          
          {activeTab === 'files' && (
            <div className="p-6">
              <ProjectFilesView 
                projectId={project.id}
                files={projectFiles}
                canUpload={false} // Clients typically can't upload, but this could be configurable
              />
            </div>
          )}
          
          {activeTab === 'invoices' && (
            <div className="p-6">
              <ProjectInvoicesView 
                projectId={project.id}
                invoices={invoices}
              />
            </div>
          )}
          
          {activeTab === 'time' && (
            <div className="p-6">
              <ProjectTimeTrackingView 
                projectId={project.id}
                timeEntries={timeEntries}
                estimatedHours={project.estimated_hours || undefined}
                budgetType={project.fixed_price ? 'fixed' : 'hourly'}
                budget={project.fixed_price || project.hourly_rate || undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}