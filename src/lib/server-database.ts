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
  // Use admin client for admin users to bypass RLS
  const client = isAdmin ? supabaseAdmin : supabase
  
  // Get projects first
  let query = client
    .from('projects')
    .select('*')

  // If not admin, filter to user's projects only (for now, admin sees all)
  // TODO: Implement proper filtering based on client access or team membership
  if (!isAdmin && userId) {
    // For now, show all projects for non-admin users
    // This will need to be updated when we implement proper client/team member filtering
  }

  const { data: projects, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  
  if (projects.length === 0) {
    return []
  }
  
  // Get all unique client IDs from projects
  const clientIds = [...new Set(projects.map(p => p.client_id).filter(Boolean))]
  
  let clientsMap = new Map()
  
  if (clientIds.length > 0) {
    // NEW SCHEMA: Try to fetch from client_companies first
    const { data: clientCompanies, error: companiesError } = await supabaseAdmin
      .from('client_companies')
      .select(`
        id, 
        company_name, 
        industry, 
        status,
        client_contacts!client_contacts_client_company_id_fkey (
          id,
          full_name,
          email,
          phone,
          title,
          is_primary_contact
        )
      `)
      .in('id', clientIds)
    
    if (!companiesError && clientCompanies) {
      // Create client objects from client_companies
      clientCompanies.forEach(company => {
        const primaryContact = company.client_contacts?.find(c => c.is_primary_contact) || 
                              company.client_contacts?.[0]
        
        clientsMap.set(company.id, {
          id: company.id,
          company_name: company.company_name,
          industry: company.industry,
          status: company.status,
          client_contacts: primaryContact ? {
            id: primaryContact.id,
            full_name: primaryContact.full_name,
            email: primaryContact.email,
            phone: primaryContact.phone,
            title: primaryContact.title
          } : null
        })
      })
    }
    
    // FALLBACK: For any remaining client IDs not found in client_companies, 
    // try user_profiles (backward compatibility during migration)
    const remainingClientIds = clientIds.filter(id => !clientsMap.has(id))
    
    if (remainingClientIds.length > 0) {
      const { data: userProfiles, error: userError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, full_name, email, company_name')
        .in('id', remainingClientIds)
      
      if (!userError && userProfiles) {
        // Create client-like objects from user profiles (legacy support)
        userProfiles.forEach(user => {
          clientsMap.set(user.id, {
            id: user.id,
            company_name: user.company_name || user.full_name || 'Unknown Client',
            industry: null,
            status: 'active',
            client_contacts: {
              id: user.id,
              full_name: user.full_name,
              email: user.email
            }
          })
        })
      }
    }
  }
  
  // Combine projects with client data
  const projectsWithClients = projects.map(project => ({
    ...project,
    client_companies: project.client_id ? clientsMap.get(project.client_id) : null
  }))
  
  return projectsWithClients
}

export async function getProjectsByClient(clientId: string) {
  // Get projects for a specific client
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  if (!projects || projects.length === 0) {
    return []
  }
  
  // NEW SCHEMA: Get client data from client_companies table
  const { data: clientCompany, error: companyError } = await supabaseAdmin
    .from('client_companies')
    .select(`
      id, 
      company_name, 
      industry, 
      status,
      client_contacts!client_contacts_client_company_id_fkey (
        id,
        full_name,
        email,
        phone,
        title,
        role,
        is_primary_contact
      )
    `)
    .eq('id', clientId)
    .single()
  
  let clientData = null
  if (!companyError && clientCompany) {
    // Find primary contact or first contact
    const primaryContact = clientCompany.client_contacts?.find(c => c.is_primary_contact) || 
                          clientCompany.client_contacts?.[0]
    
    clientData = {
      id: clientCompany.id,
      company_name: clientCompany.company_name,
      industry: clientCompany.industry,
      status: clientCompany.status,
      client_contacts: primaryContact ? {
        id: primaryContact.id,
        full_name: primaryContact.full_name,
        email: primaryContact.email,
        phone: primaryContact.phone,
        title: primaryContact.title
      } : null
    }
  }
  
  // Add client data to all projects
  const projectsWithClient = projects.map(project => ({
    ...project,
    client_companies: clientData
  }))
  
  return projectsWithClient
}

export async function getProject(projectId: string) {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) throw error
  
  // If project has a client_id, try to fetch from client_companies first
  if (project?.client_id) {
    // NEW SCHEMA: Try client_companies first
    const { data: clientCompany, error: companyError } = await supabaseAdmin
      .from('client_companies')
      .select(`
        id, 
        company_name, 
        industry, 
        status,
        website,
        client_contacts!client_contacts_client_company_id_fkey (
          id,
          full_name,
          email,
          phone,
          title,
          is_primary_contact
        )
      `)
      .eq('id', project.client_id)
      .single()
    
    if (!companyError && clientCompany) {
      const primaryContact = clientCompany.client_contacts?.find(c => c.is_primary_contact) || 
                            clientCompany.client_contacts?.[0]
      
      return {
        ...project,
        client_companies: {
          id: clientCompany.id,
          company_name: clientCompany.company_name,
          industry: clientCompany.industry,
          status: clientCompany.status,
          website: clientCompany.website,
          client_contacts: primaryContact ? {
            id: primaryContact.id,
            full_name: primaryContact.full_name,
            email: primaryContact.email,
            phone: primaryContact.phone,
            title: primaryContact.title
          } : null
        }
      }
    }
    
    // FALLBACK: Try user_profiles for backward compatibility
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name, email, company_name')
      .eq('id', project.client_id)
      .single()
    
    if (!userError && userProfile) {
      return {
        ...project,
        client_companies: {
          id: userProfile.id,
          company_name: userProfile.company_name || userProfile.full_name || 'Unknown Client',
          industry: null,
          status: 'active',
          website: null,
          client_contacts: {
            id: userProfile.id,
            full_name: userProfile.full_name,
            email: userProfile.email,
            phone: null,
            title: null
          }
        }
      }
    }
  }
  
  return {
    ...project,
    client_companies: null
  }
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
    // Use admin client for admin users to bypass RLS
    const client = isAdmin ? supabaseAdmin : supabase
    
    // Get project counts
    let projectQuery = client
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
    let timeQuery = client
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
    let invoiceQuery = client
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