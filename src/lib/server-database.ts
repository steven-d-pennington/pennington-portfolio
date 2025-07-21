// Server-side database utilities for API routes
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Server-side Supabase client with service role
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Regular supabase client for authenticated requests
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export { supabase, supabaseAdmin }

// Helper functions
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatHours = (hours: number) => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.round((hours % 1) * 60)
  
  if (minutes === 0) {
    return `${wholeHours}h`
  }
  return `${wholeHours}h ${minutes}m`
}

// Server-side database operations
export async function getProjects(userId?: string, isAdmin: boolean = false) {
  let query = supabase
    .from('projects')
    .select(`
      *,
      user_profiles!client_id (
        id,
        full_name,
        email,
        company_name
      )
    `)

  // If not admin, filter to user's projects only
  if (!isAdmin && userId) {
    query = query.or(`client_id.eq.${userId},project_members.user_id.eq.${userId}`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProject(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      user_profiles!client_id (
        id,
        full_name,
        email,
        company_name
      ),
      project_members (
        id,
        role,
        can_track_time,
        can_view_financials,
        user_profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      )
    `)
    .eq('id', projectId)
    .single()

  if (error) throw error
  return data
}

export async function getDashboardStats(userId: string, isAdmin: boolean = false) {
  const stats = {
    totalProjects: 0,
    activeProjects: 0,
    totalHoursWorked: 0,
    outstandingInvoices: 0,
    totalRevenue: 0,
    recentActivity: [] as any[]
  }

  try {
    // Get project counts
    let projectQuery = supabase
      .from('projects')
      .select('id, status')

    if (!isAdmin) {
      projectQuery = projectQuery.or(`client_id.eq.${userId},project_members.user_id.eq.${userId}`)
    }

    const { data: projects } = await projectQuery
    if (projects) {
      stats.totalProjects = projects.length
      stats.activeProjects = projects.filter(p => p.status === 'active').length
    }

    // Get time tracking stats
    let timeQuery = supabase
      .from('time_entries')
      .select('hours_worked, is_billable, hourly_rate')

    if (!isAdmin) {
      timeQuery = timeQuery.in('project_id', projects?.map(p => p.id) || [])
    }

    const { data: timeEntries } = await timeQuery
    if (timeEntries) {
      stats.totalHoursWorked = timeEntries.reduce((sum, entry) => sum + entry.hours_worked, 0)
    }

    // Get invoice stats
    let invoiceQuery = supabase
      .from('invoices')
      .select('total_amount, status')

    if (!isAdmin) {
      invoiceQuery = invoiceQuery.eq('client_id', userId)
    }

    const { data: invoices } = await invoiceQuery
    if (invoices) {
      stats.outstandingInvoices = invoices.filter(i => i.status === 'sent').length
      stats.totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.total_amount, 0)
    }

    return stats
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return stats
  }
}