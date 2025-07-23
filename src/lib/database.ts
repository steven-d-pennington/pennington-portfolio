// Database utilities for Client Dashboard
import { supabase } from '@/utils/supabase'
import { supabaseAdmin } from '@/lib/server-database'
import type { Database, ProjectWithClient, TimeEntryWithProject, InvoiceWithProject, Project, TimeEntry, Invoice, InvoiceLineItem } from '@/types/database'

// Re-export singleton browser client
export { supabase }

// Re-export admin client from server-database
export { supabaseAdmin }

// Database query utilities
export class DatabaseService {
  private client: typeof supabase

  constructor(client = supabase) {
    this.client = client
  }

  // User Profile operations
  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await this.client
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Project operations
  async getProjects(userId?: string, isAdmin: boolean = false) {
    let query = this.client
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
    return data as ProjectWithClient[]
  }

  async getProject(projectId: string) {
    const { data, error } = await this.client
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

  async createProject(projectData: any) {
    const { data, error } = await this.client
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateProject(projectId: string, updates: any) {
    const { data, error } = await this.client
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Time entry operations
  async getTimeEntries(projectId?: string, userId?: string, startDate?: string, endDate?: string) {
    let query = this.client
      .from('time_entries')
      .select(`
        *,
        projects (
          id,
          name,
          client_id
        ),
        user_profiles (
          id,
          full_name,
          avatar_url
        )
      `)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (startDate) {
      query = query.gte('date_worked', startDate)
    }

    if (endDate) {
      query = query.lte('date_worked', endDate)
    }

    const { data, error } = await query.order('date_worked', { ascending: false })

    if (error) throw error
    return data as TimeEntryWithProject[]
  }

  async createTimeEntry(timeEntryData: any) {
    const { data, error } = await this.client
      .from('time_entries')
      .insert(timeEntryData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTimeEntry(entryId: string, updates: any) {
    const { data, error } = await this.client
      .from('time_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTimeEntry(entryId: string) {
    const { error } = await this.client
      .from('time_entries')
      .delete()
      .eq('id', entryId)

    if (error) throw error
  }

  // Invoice operations
  async getInvoices(clientId?: string, projectId?: string, status?: string) {
    let query = this.client
      .from('invoices')
      .select(`
        *,
        projects (
          id,
          name
        ),
        user_profiles!client_id (
          id,
          full_name,
          email,
          company_name
        )
      `)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data as InvoiceWithProject[]
  }

  async getInvoice(invoiceId: string) {
    const { data, error } = await this.client
      .from('invoices')
      .select(`
        *,
        projects (
          id,
          name
        ),
        user_profiles!client_id (
          id,
          full_name,
          email,
          company_name,
          address
        ),
        invoice_line_items (*),
        payments (*)
      `)
      .eq('id', invoiceId)
      .single()

    if (error) throw error
    return data
  }

  async createInvoice(invoiceData: any) {
    const { data, error } = await this.client
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateInvoice(invoiceId: string, updates: any) {
    const { data, error } = await this.client
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Payment operations
  async createPayment(paymentData: any) {
    const { data, error } = await this.client
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPayments(invoiceId?: string) {
    let query = this.client
      .from('payments')
      .select(`
        *,
        invoices (
          id,
          invoice_number,
          total_amount
        )
      `)

    if (invoiceId) {
      query = query.eq('invoice_id', invoiceId)
    }

    const { data, error } = await query.order('payment_date', { ascending: false })

    if (error) throw error
    return data
  }

  // GitHub webhook operations
  async createGitHubEvent(eventData: any) {
    const { data, error } = await this.client
      .from('github_webhook_events')
      .insert(eventData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getGitHubEvents(projectId: string, limit: number = 50) {
    const { data, error } = await this.client
      .from('github_webhook_events')
      .select('*')
      .eq('project_id', projectId)
      .order('event_timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Project updates operations
  async getProjectUpdates(projectId: string, visibleToClient: boolean = true) {
    let query = this.client
      .from('project_updates')
      .select(`
        *,
        user_profiles!author_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)

    if (visibleToClient) {
      query = query.eq('visible_to_client', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createProjectUpdate(updateData: any) {
    const { data, error } = await this.client
      .from('project_updates')
      .insert(updateData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Dashboard analytics
  async getDashboardStats(userId: string, isAdmin: boolean = false) {
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
      let projectQuery = this.client
        .from('projects')
        .select('id, status')

      if (!isAdmin) {
        projectQuery = projectQuery.or(`client_id.eq.${userId},project_members.user_id.eq.${userId}`)
      }

      const { data: projects } = await projectQuery
      if (projects) {
        stats.totalProjects = projects.length
        stats.activeProjects = projects.filter((p: { id: any; status: any }) => p.status === 'active').length
      }

      // Get time tracking stats
      let timeQuery = this.client
        .from('time_entries')
        .select('hours_worked, is_billable, hourly_rate')

      if (!isAdmin) {
        timeQuery = timeQuery.in('project_id', projects?.map((p: { id: any; status: any }) => p.id) || [])
      }

      const { data: timeEntries } = await timeQuery
      if (timeEntries) {
        stats.totalHoursWorked = timeEntries.reduce((sum: number, entry: { hours_worked: any; is_billable: any; hourly_rate: any }) => sum + entry.hours_worked, 0)
      }

      // Get invoice stats
      let invoiceQuery = this.client
        .from('invoices')
        .select('total_amount, status')

      if (!isAdmin) {
        invoiceQuery = invoiceQuery.eq('client_id', userId)
      }

      const { data: invoices } = await invoiceQuery
      if (invoices) {
        stats.outstandingInvoices = invoices.filter((i: { total_amount: any; status: any }) => i.status === 'sent').length
        stats.totalRevenue = invoices
          .filter((i: { total_amount: any; status: any }) => i.status === 'paid')
          .reduce((sum: number, invoice: { total_amount: any; status: any }) => sum + invoice.total_amount, 0)
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return stats
    }
  }

  // Project member operations
  async addProjectMember(projectId: string, userId: string, role: string = 'developer') {
    const { data, error } = await this.client
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeProjectMember(projectId: string, userId: string) {
    const { error } = await this.client
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId)

    if (error) throw error
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Helper functions for common operations
export const isAdmin = (userRole: string | null) => userRole === 'admin'
export const isClient = (userRole: string | null) => userRole === 'client'
export const canManageProject = (userRole: string | null, projectClientId: string, userId: string) => {
  return isAdmin(userRole) || projectClientId === userId
}

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

export const calculateInvoiceTotal = (lineItems: InvoiceLineItem[]) => {
  const subtotal = lineItems.reduce((sum: number, item: InvoiceLineItem) => sum + item.total_price, 0)
  return subtotal
}