#!/usr/bin/env tsx

/**
 * Database Seeding Script for Pennington Portfolio Dashboard
 * 
 * This script generates comprehensive test data for:
 * - User profiles with different roles
 * - Projects across all status types
 * - Project members and assignments
 * - Time entries with realistic work patterns
 * - Invoices and payments
 * - Project updates and milestones
 * - GitHub webhook events
 * 
 * Usage: npm run seed
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database'

// Types for seeding
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectMemberInsert = Database['public']['Tables']['project_members']['Insert']
type TimeEntryInsert = Database['public']['Tables']['time_entries']['Insert']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceLineItemInsert = Database['public']['Tables']['invoice_line_items']['Insert']
type PaymentInsert = Database['public']['Tables']['payments']['Insert']
type ProjectUpdateInsert = Database['public']['Tables']['project_updates']['Insert']
type GitHubEventInsert = Database['public']['Tables']['github_webhook_events']['Insert']

// Environment validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Admin client for seeding
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Utility functions
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

const randomPastDate = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date.toISOString()
}

const randomFutureDate = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + Math.floor(Math.random() * daysFromNow))
  return date.toISOString()
}

const randomFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Test Data Collections
const SAMPLE_USERS: UserProfileInsert[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'alex.chen@techstartup.com',
    full_name: 'Alex Chen',
    role: 'client',
    company_name: 'TechStartup Inc',
    phone: '+1-555-0101',
    address: '123 Innovation Drive, San Francisco, CA 94107',
    timezone: 'America/Los_Angeles'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'sarah.johnson@designco.com',
    full_name: 'Sarah Johnson',
    role: 'team_member',
    company_name: 'Monkey LoveStack',
    phone: '+1-555-0102',
    address: '456 Creative Street, Austin, TX 78701',
    timezone: 'America/Chicago'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'michael.rodriguez@enterprise.com',
    full_name: 'Michael Rodriguez',
    role: 'client',
    company_name: 'Enterprise Solutions LLC',
    phone: '+1-555-0103',
    address: '789 Business Plaza, New York, NY 10001',
    timezone: 'America/New_York'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'emma.wilson@freelance.dev',
    full_name: 'Emma Wilson',
    role: 'team_member',
    company_name: 'Monkey LoveStack',
    phone: '+1-555-0104',
    address: '321 Remote Work Lane, Portland, OR 97201',
    timezone: 'America/Los_Angeles'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'david.kim@healthtech.org',
    full_name: 'David Kim',
    role: 'client',
    company_name: 'HealthTech Solutions',
    phone: '+1-555-0105',
    address: '654 Medical Center Dr, Boston, MA 02115',
    timezone: 'America/New_York'
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'maria.garcia@consultant.com',
    full_name: 'Maria Garcia',
    role: 'team_member',
    company_name: 'Monkey LoveStack',
    phone: '+1-555-0106',
    address: '987 Consultant Circle, Denver, CO 80202',
    timezone: 'America/Denver'
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    email: 'james.brown@retail.com',
    full_name: 'James Brown',
    role: 'client',
    company_name: 'RetailMax Corporation',
    phone: '+1-555-0107',
    address: '147 Commerce Street, Atlanta, GA 30309',
    timezone: 'America/New_York'
  }
]

const SAMPLE_PROJECTS: ProjectInsert[] = [
  {
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of existing e-commerce platform with modern React frontend, microservices backend, and AWS cloud infrastructure.',
    client_id: '11111111-1111-1111-1111-111111111111', // Alex Chen
    status: 'active',
    start_date: randomPastDate(45),
    end_date: randomFutureDate(30),
    estimated_hours: 280,
    hourly_rate: 150,
    github_repo_url: 'https://github.com/techstartup/ecommerce-platform',
    github_repo_name: 'ecommerce-platform',
    github_default_branch: 'main'
  },
  {
    name: 'Mobile Banking App',
    description: 'Cross-platform mobile application for digital banking services with biometric authentication and real-time notifications.',
    client_id: '33333333-3333-3333-3333-333333333333', // Michael Rodriguez
    status: 'planning',
    start_date: randomFutureDate(14),
    end_date: randomFutureDate(120),
    estimated_hours: 450,
    fixed_price: 85000,
    github_repo_url: 'https://github.com/enterprise/mobile-banking',
    github_repo_name: 'mobile-banking-app',
    github_default_branch: 'develop'
  },
  {
    name: 'Healthcare Data Analytics Dashboard',
    description: 'HIPAA-compliant analytics dashboard for healthcare providers with real-time patient data visualization.',
    client_id: '55555555-5555-5555-5555-555555555555', // David Kim
    status: 'active',
    start_date: randomPastDate(60),
    end_date: randomFutureDate(45),
    estimated_hours: 320,
    hourly_rate: 175,
    github_repo_url: 'https://github.com/healthtech/analytics-dashboard',
    github_repo_name: 'healthcare-analytics',
    github_default_branch: 'main'
  },
  {
    name: 'Inventory Management System',
    description: 'Enterprise inventory management system with barcode scanning, automated reordering, and supplier integration.',
    client_id: '77777777-7777-7777-7777-777777777777', // James Brown
    status: 'completed',
    start_date: randomPastDate(120),
    end_date: randomPastDate(30),
    estimated_hours: 180,
    hourly_rate: 140,
    github_repo_url: 'https://github.com/retailmax/inventory-system',
    github_repo_name: 'inventory-management',
    github_default_branch: 'master'
  },
  {
    name: 'API Gateway Migration',
    description: 'Migration from legacy API gateway to modern cloud-native solution with improved performance and security.',
    client_id: '11111111-1111-1111-1111-111111111111', // Alex Chen
    status: 'on_hold',
    start_date: randomPastDate(90),
    estimated_hours: 120,
    hourly_rate: 160
  },
  {
    name: 'Customer Portal Enhancement',
    description: 'Enhanced customer self-service portal with AI-powered chatbot and advanced search capabilities.',
    client_id: '33333333-3333-3333-3333-333333333333', // Michael Rodriguez
    status: 'active',
    start_date: randomPastDate(30),
    end_date: randomFutureDate(60),
    estimated_hours: 200,
    hourly_rate: 145,
    github_repo_url: 'https://github.com/enterprise/customer-portal',
    github_repo_name: 'customer-portal-v2',
    github_default_branch: 'main'
  },
  {
    name: 'DevOps Pipeline Setup',
    description: 'Complete CI/CD pipeline implementation with automated testing, deployment, and monitoring.',
    client_id: '55555555-5555-5555-5555-555555555555', // David Kim
    status: 'completed',
    start_date: randomPastDate(75),
    end_date: randomPastDate(15),
    estimated_hours: 80,
    fixed_price: 15000
  },
  {
    name: 'Blockchain Integration POC',
    description: 'Proof of concept for blockchain-based supply chain tracking system.',
    client_id: '77777777-7777-7777-7777-777777777777', // James Brown
    status: 'cancelled',
    start_date: randomPastDate(150),
    estimated_hours: 60,
    hourly_rate: 200
  },
  {
    name: 'Legacy System Modernization',
    description: 'Gradual modernization of legacy COBOL systems to modern Java-based microservices architecture.',
    client_id: '33333333-3333-3333-3333-333333333333', // Michael Rodriguez
    status: 'planning',
    start_date: randomFutureDate(30),
    end_date: randomFutureDate(365),
    estimated_hours: 800,
    hourly_rate: 180,
    github_repo_url: 'https://github.com/enterprise/legacy-modernization',
    github_repo_name: 'legacy-modernization',
    github_default_branch: 'develop'
  }
]

const TIME_ENTRY_TYPES: Array<Database['public']['Enums']['time_entry_type']> = [
  'development', 'design', 'meeting', 'testing', 'deployment', 'consultation', 'other'
]

const TIME_ENTRY_DESCRIPTIONS = {
  development: [
    'Implemented user authentication system',
    'Built responsive dashboard components',
    'Optimized database queries for better performance',
    'Added real-time notifications feature',
    'Integrated third-party payment gateway',
    'Fixed critical security vulnerabilities',
    'Developed API endpoints for mobile app',
    'Refactored legacy code to modern patterns'
  ],
  design: [
    'Created wireframes for new features',
    'Designed responsive layouts',
    'Updated brand guidelines and style guide',
    'Prototyped user interaction flows',
    'Conducted UX research sessions'
  ],
  meeting: [
    'Sprint planning with development team',
    'Client requirements gathering session',
    'Architecture review meeting',
    'Daily standup - progress updates',
    'Code review session with team',
    'Project retrospective meeting'
  ],
  testing: [
    'Automated test suite implementation',
    'Manual testing of new features',
    'Performance testing and optimization',
    'Security penetration testing',
    'User acceptance testing coordination'
  ],
  deployment: [
    'Production deployment and monitoring',
    'CI/CD pipeline configuration',
    'Environment setup and configuration',
    'Database migration execution',
    'Rollback procedures implementation'
  ],
  consultation: [
    'Technical architecture consultation',
    'Best practices review session',
    'Security audit and recommendations',
    'Performance optimization consultation',
    'Technology stack evaluation'
  ],
  other: [
    'Project documentation updates',
    'Team training session',
    'Research and development',
    'Tool evaluation and setup',
    'Administrative tasks'
  ]
}

const PROJECT_UPDATE_TYPES = ['milestone', 'progress', 'issue', 'completion', 'change_request']

async function clearExistingData() {
  console.log('🧹 Clearing existing test data...')
  
  // Delete in order to respect foreign key constraints
  await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('invoice_line_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('time_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('github_webhook_events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_members').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  // Don't delete user profiles for existing users like steven@spennington.dev
  // Only delete our test users
  const testUserIds = SAMPLE_USERS.map(user => user.id).filter(Boolean)
  if (testUserIds.length > 0) {
    await supabase.from('user_profiles').delete().in('id', testUserIds)
  }
  
  console.log('✅ Existing test data cleared')
}

async function seedUsers() {
  console.log('👥 Seeding user profiles...')
  
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(SAMPLE_USERS)
    .select()
  
  if (error) {
    console.error('❌ Error seeding users:', error)
    throw error
  }
  
  console.log(`✅ Created ${data.length} user profiles`)
  return data
}

async function seedProjects() {
  console.log('🏗️ Seeding projects...')
  
  const { data, error } = await supabase
    .from('projects')
    .insert(SAMPLE_PROJECTS)
    .select()
  
  if (error) {
    console.error('❌ Error seeding projects:', error)
    throw error
  }
  
  console.log(`✅ Created ${data.length} projects`)
  return data
}

async function seedProjectMembers(projects: any[], users: any[]) {
  console.log('👨‍💼 Seeding project members...')
  
  const teamMembers = users.filter(user => user.role === 'team_member')
  const projectMembers: ProjectMemberInsert[] = []
  
  // Assign team members to projects
  projects.forEach(project => {
    // Each project gets 1-3 team members
    const memberCount = Math.floor(Math.random() * 3) + 1
    const assignedMembers = teamMembers.sort(() => 0.5 - Math.random()).slice(0, memberCount)
    
    assignedMembers.forEach((member, index) => {
      projectMembers.push({
        project_id: project.id,
        user_id: member.id,
        role: index === 0 ? 'Lead Developer' : randomFromArray(['Developer', 'Designer', 'QA Engineer', 'DevOps Engineer']),
        can_track_time: true,
        can_view_financials: index === 0 // Only lead can view financials
      })
    })
  })
  
  const { data, error } = await supabase
    .from('project_members')
    .insert(projectMembers)
    .select()
  
  if (error) {
    console.error('❌ Error seeding project members:', error)
    throw error
  }
  
  console.log(`✅ Created ${data.length} project member assignments`)
  return data
}

async function seedTimeEntries(projects: any[], projectMembers: any[]) {
  console.log('⏰ Seeding time entries...')
  
  const timeEntries: TimeEntryInsert[] = []
  
  // Generate time entries for active and completed projects
  const activeProjects = projects.filter(p => ['active', 'completed'].includes(p.status))
  
  activeProjects.forEach(project => {
    const members = projectMembers.filter(pm => pm.project_id === project.id)
    
    // Generate 10-50 time entries per active project
    const entryCount = Math.floor(Math.random() * 40) + 10
    
    for (let i = 0; i < entryCount; i++) {
      const member = randomFromArray(members)
      const entryType = randomFromArray(TIME_ENTRY_TYPES)
      const hoursWorked = Math.round((Math.random() * 7 + 1) * 4) / 4 // 1-8 hours in 15min increments
      const dateWorked = randomPastDate(90)
      
      timeEntries.push({
        project_id: project.id,
        user_id: member.user_id,
        hours_worked: hoursWorked,
        description: randomFromArray(TIME_ENTRY_DESCRIPTIONS[entryType]),
        entry_type: entryType,
        is_billable: Math.random() > 0.1, // 90% billable
        hourly_rate: project.hourly_rate || 150,
        date_worked: dateWorked.split('T')[0], // Date only
        created_at: dateWorked
      })
    }
  })
  
  // Insert in batches to avoid timeout
  const batchSize = 50
  const totalEntries = timeEntries.length
  let insertedCount = 0
  
  for (let i = 0; i < timeEntries.length; i += batchSize) {
    const batch = timeEntries.slice(i, i + batchSize)
    const { error } = await supabase.from('time_entries').insert(batch)
    
    if (error) {
      console.error('❌ Error seeding time entries batch:', error)
      throw error
    }
    
    insertedCount += batch.length
    console.log(`   📊 Inserted ${insertedCount}/${totalEntries} time entries`)
  }
  
  console.log(`✅ Created ${totalEntries} time entries`)
  return timeEntries
}

async function seedProjectUpdates(projects: any[], users: any[]) {
  console.log('📝 Seeding project updates...')
  
  const updates: ProjectUpdateInsert[] = []
  const teamMembers = users.filter(u => u.role === 'team_member')
  
  projects.forEach(project => {
    // Generate 2-8 updates per project
    const updateCount = Math.floor(Math.random() * 6) + 2
    
    for (let i = 0; i < updateCount; i++) {
      const updateType = randomFromArray(PROJECT_UPDATE_TYPES)
      const author = randomFromArray(teamMembers)
      
      const updateTitles = {
        milestone: [`${project.name} - Phase ${i + 1} Complete`, `Milestone: ${randomFromArray(['MVP', 'Beta', 'Testing', 'Deployment'])} Reached`],
        progress: [`Weekly Progress Update - Week ${i + 1}`, `Development Update: ${randomFromArray(['Frontend', 'Backend', 'Database', 'API'])} Progress`],
        issue: [`Issue Resolved: ${randomFromArray(['Performance', 'Security', 'UI/UX', 'Integration'])}`, `Bug Fix: Critical ${randomFromArray(['Login', 'Payment', 'Data', 'Mobile'])} Issue`],
        completion: [`${project.name} - Feature Complete`, `Phase ${i + 1} Delivery Complete`],
        change_request: [`Scope Change: ${randomFromArray(['Additional Features', 'Design Updates', 'Technical Changes'])}`, `Client Request: ${randomFromArray(['New Requirements', 'Timeline Adjustment', 'Feature Modification'])}`]
      }
      
      const updateContent = {
        milestone: 'Successfully completed major project milestone. All deliverables met quality standards and client approval received.',
        progress: 'Steady progress on development tasks. Team velocity is on track with project timeline. No major blockers identified.',
        issue: 'Identified and resolved critical issue that was impacting system performance. Implemented fix and verified resolution through testing.',
        completion: 'Project phase completed successfully. All acceptance criteria met and client sign-off received. Ready for next phase.',
        change_request: 'Client has requested additional features and scope changes. Impact assessment completed and timeline adjusted accordingly.'
      }
      
      updates.push({
        project_id: project.id,
        author_id: author.id,
        title: randomFromArray(updateTitles[updateType]),
        content: updateContent[updateType],
        update_type: updateType,
        visible_to_client: Math.random() > 0.3, // 70% visible to client
        created_at: randomPastDate(60)
      })
    }
  })
  
  const { data, error } = await supabase
    .from('project_updates')
    .insert(updates)
    .select()
  
  if (error) {
    console.error('❌ Error seeding project updates:', error)
    throw error
  }
  
  console.log(`✅ Created ${data.length} project updates`)
  return data
}

async function seedInvoicesAndPayments(projects: any[], timeEntries: TimeEntryInsert[]) {
  console.log('💰 Seeding invoices and payments...')
  
  const invoices: InvoiceInsert[] = []
  const invoiceLineItems: InvoiceLineItemInsert[] = []
  const payments: PaymentInsert[] = []
  
  // Generate invoices for completed projects and some active ones
  const billableProjects = projects.filter(p => ['completed', 'active'].includes(p.status))
  
  let invoiceNumber = 1001
  
  billableProjects.forEach(project => {
    // Generate 1-3 invoices per project
    const invoiceCount = project.status === 'completed' ? Math.floor(Math.random() * 2) + 1 : Math.random() > 0.7 ? 1 : 0
    
    for (let i = 0; i < invoiceCount; i++) {
      const issueDate = randomPastDate(60)
      const dueDate = new Date(issueDate)
      dueDate.setDate(dueDate.getDate() + 30)
      
      const invoiceId = `invoice-${invoiceNumber}`
      
      // Calculate invoice amount based on time entries
      const projectTimeEntries = timeEntries.filter(te => te.project_id === project.id && te.is_billable)
      const entryCount = Math.min(Math.floor(Math.random() * 20) + 5, projectTimeEntries.length)
      const selectedEntries = projectTimeEntries.slice(0, entryCount)
      
      let subtotal = 0
      
      if (project.fixed_price && i === invoiceCount - 1) {
        // Final invoice for fixed price project
        subtotal = project.fixed_price
        invoiceLineItems.push({
          invoice_id: invoiceId,
          description: `${project.name} - Fixed Price Development`,
          quantity: 1,
          unit_price: project.fixed_price,
          total_price: project.fixed_price
        })
      } else {
        // Hourly billing
        selectedEntries.forEach(entry => {
          const lineTotal = entry.hours_worked * (entry.hourly_rate || 150)
          subtotal += lineTotal
          
          invoiceLineItems.push({
            invoice_id: invoiceId,
            description: `${entry.description} - ${entry.hours_worked}h @ $${entry.hourly_rate}/hr`,
            quantity: entry.hours_worked,
            unit_price: entry.hourly_rate || 150,
            total_price: lineTotal,
            time_entry_ids: [entry.id || '']
          })
        })
      }
      
      const taxRate = 0.08 // 8% tax
      const taxAmount = subtotal * taxRate
      const totalAmount = subtotal + taxAmount
      
      const invoiceStatus = randomFromArray(['paid', 'paid', 'sent', 'overdue'] as const)
      
      invoices.push({
        id: invoiceId,
        project_id: project.id,
        client_id: project.client_id,
        invoice_number: `INV-${invoiceNumber}`,
        title: `${project.name} - Invoice #${invoiceNumber}`,
        description: `Professional development services for ${project.name}`,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: invoiceStatus,
        issue_date: issueDate,
        due_date: dueDate.toISOString(),
        sent_date: invoiceStatus !== 'draft' ? issueDate : null,
        paid_date: invoiceStatus === 'paid' ? randomDate(new Date(issueDate), new Date()) : null
      })
      
      // Generate payment for paid invoices
      if (invoiceStatus === 'paid') {
        const paymentMethod = randomFromArray(['credit_card', 'bank_transfer', 'paypal'] as const)
        const processorFee = paymentMethod === 'credit_card' ? totalAmount * 0.029 : 0
        
        payments.push({
          invoice_id: invoiceId,
          amount: totalAmount,
          method: paymentMethod,
          transaction_id: `txn_${Math.random().toString(36).substr(2, 9)}`,
          reference_number: `REF${invoiceNumber}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          processor_name: paymentMethod === 'credit_card' ? 'Stripe' : paymentMethod === 'paypal' ? 'PayPal' : 'Bank',
          processor_fee: processorFee,
          net_amount: totalAmount - processorFee,
          payment_date: invoices[invoices.length - 1].paid_date,
          processed_at: invoices[invoices.length - 1].paid_date,
          notes: `Payment processed via ${paymentMethod}`
        })
      }
      
      invoiceNumber++
    }
  })
  
  // Insert invoices
  const { error: invoiceError } = await supabase.from('invoices').insert(invoices)
  if (invoiceError) {
    console.error('❌ Error seeding invoices:', invoiceError)
    throw invoiceError
  }
  
  // Insert line items
  const { error: lineItemError } = await supabase.from('invoice_line_items').insert(invoiceLineItems)
  if (lineItemError) {
    console.error('❌ Error seeding invoice line items:', lineItemError)
    throw lineItemError
  }
  
  // Insert payments
  const { error: paymentError } = await supabase.from('payments').insert(payments)
  if (paymentError) {
    console.error('❌ Error seeding payments:', paymentError)
    throw paymentError
  }
  
  console.log(`✅ Created ${invoices.length} invoices, ${invoiceLineItems.length} line items, ${payments.length} payments`)
  return { invoices, invoiceLineItems, payments }
}

async function seedGitHubEvents(projects: any[]) {
  console.log('🐙 Seeding GitHub webhook events...')
  
  const events: GitHubEventInsert[] = []
  const eventTypes = ['push', 'pull_request', 'create', 'delete', 'release']
  
  // Only generate events for projects with GitHub repos
  const githubProjects = projects.filter(p => p.github_repo_url)
  
  githubProjects.forEach(project => {
    // Generate 5-20 events per project
    const eventCount = Math.floor(Math.random() * 15) + 5
    
    for (let i = 0; i < eventCount; i++) {
      const eventType = randomFromArray(eventTypes)
      const author = randomFromArray(['sarah.johnson', 'emma.wilson', 'maria.garcia', 'steven.pennington'])
      
      events.push({
        project_id: project.id,
        event_type: eventType,
        commit_sha: eventType === 'push' ? Math.random().toString(36).substr(2, 40) : null,
        commit_message: eventType === 'push' ? randomFromArray([
          'Fix: Resolve authentication bug',
          'Feature: Add user profile management',
          'Update: Improve error handling',
          'Refactor: Optimize database queries',
          'Docs: Update API documentation',
          'Test: Add unit tests for new features'
        ]) : null,
        author_name: author.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        author_email: `${author}@monkeylovestack.com`,
        branch_name: eventType === 'push' ? randomFromArray(['main', 'develop', 'feature/user-auth', 'hotfix/security-patch']) : null,
        raw_payload: {
          repository: project.github_repo_name,
          ref: `refs/heads/${eventType === 'push' ? 'main' : 'develop'}`,
          before: Math.random().toString(36).substr(2, 40),
          after: Math.random().toString(36).substr(2, 40)
        },
        processed: Math.random() > 0.1, // 90% processed
        processed_at: Math.random() > 0.1 ? randomPastDate(30) : null,
        event_timestamp: randomPastDate(45)
      })
    }
  })
  
  const { data, error } = await supabase
    .from('github_webhook_events')
    .insert(events)
    .select()
  
  if (error) {
    console.error('❌ Error seeding GitHub events:', error)
    throw error
  }
  
  console.log(`✅ Created ${data.length} GitHub webhook events`)
  return data
}

async function main() {
  console.log('🌱 Starting database seeding process...')
  console.log('=' .repeat(50))
  
  try {
    // Clear existing test data
    await clearExistingData()
    
    // Seed in order due to foreign key dependencies
    const users = await seedUsers()
    const projects = await seedProjects()
    const projectMembers = await seedProjectMembers(projects, users)
    const timeEntries = await seedTimeEntries(projects, projectMembers)
    const projectUpdates = await seedProjectUpdates(projects, users)
    const { invoices, payments } = await seedInvoicesAndPayments(projects, timeEntries)
    const githubEvents = await seedGitHubEvents(projects)
    
    console.log('=' .repeat(50))
    console.log('🎉 Database seeding completed successfully!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   👥 Users: ${users.length}`)
    console.log(`   🏗️ Projects: ${projects.length}`)
    console.log(`   👨‍💼 Project Members: ${projectMembers.length}`)
    console.log(`   ⏰ Time Entries: ${timeEntries.length}`)
    console.log(`   📝 Project Updates: ${projectUpdates.length}`)
    console.log(`   💰 Invoices: ${invoices.length}`)
    console.log(`   💳 Payments: ${payments.length}`)
    console.log(`   🐙 GitHub Events: ${githubEvents.length}`)
    console.log('')
    console.log('🚀 Your dashboard now has rich test data for development!')
    console.log('   Visit: http://localhost:3000/dashboard/projects')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding process
main()