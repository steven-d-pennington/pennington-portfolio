/**
 * Demo Data Seeder for Monkey LoveStack Portfolio
 * Generates realistic sample data for showcasing the platform
 */

export interface DemoProject {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  client_company: string
  start_date: string
  end_date?: string
  estimated_hours: number
  hourly_rate: number
  fixed_price?: number
  github_repo_url?: string
  created_at: string
  progress: number
}

export interface DemoClient {
  id: string
  company_name: string
  industry: string
  website?: string
  status: 'prospect' | 'active' | 'inactive'
  primary_contact: {
    full_name: string
    email: string
    phone?: string
    title: string
  }
  projects_count: number
  total_revenue: number
  created_at: string
}

export interface DemoTimeEntry {
  id: string
  project_id: string
  description: string
  hours: number
  date: string
  billable: boolean
  hourly_rate: number
}

export interface DemoInvoice {
  id: string
  project_id: string
  invoice_number: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issued_date: string
  due_date: string
  paid_date?: string
}

// Sample data generators
const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 
  'Real Estate', 'Manufacturing', 'Consulting', 'Media & Entertainment', 'SaaS'
]

const projectTypes = [
  'E-commerce Platform', 'Web Application', 'Mobile App', 'API Development',
  'Database Migration', 'Cloud Infrastructure', 'DevOps Setup', 'Website Redesign',
  'Custom CRM', 'Analytics Dashboard', 'Microservices Architecture', 'Legacy Modernization'
]

const taskDescriptions = [
  'Frontend component development', 'API endpoint implementation', 'Database schema design',
  'Unit test coverage', 'Code review and refactoring', 'Performance optimization',
  'Security audit', 'Documentation updates', 'Bug fixes and debugging',
  'Client meeting and requirements gathering', 'Deployment and monitoring setup'
]

// Demo data
export const demoClients: DemoClient[] = [
  {
    id: 'demo-client-1',
    company_name: 'TechCorp Solutions',
    industry: 'Technology',
    website: 'https://techcorp-solutions.com',
    status: 'active',
    primary_contact: {
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp-solutions.com',
      phone: '+1 (555) 123-4567',
      title: 'VP of Engineering'
    },
    projects_count: 3,
    total_revenue: 145750,
    created_at: '2024-01-15T08:30:00Z'
  },
  {
    id: 'demo-client-2',
    company_name: 'GreenLeaf Ventures',
    industry: 'E-commerce',
    website: 'https://greenleaf-ventures.com',
    status: 'active',
    primary_contact: {
      full_name: 'Michael Chen',
      email: 'mike@greenleaf-ventures.com',
      phone: '+1 (555) 987-6543',
      title: 'CTO'
    },
    projects_count: 2,
    total_revenue: 89500,
    created_at: '2024-02-22T14:15:00Z'
  },
  {
    id: 'demo-client-3',
    company_name: 'HealthFirst Analytics',
    industry: 'Healthcare',
    website: 'https://healthfirst-analytics.com',
    status: 'active',
    primary_contact: {
      full_name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@healthfirst.com',
      phone: '+1 (555) 456-7890',
      title: 'Chief Medical Officer'
    },
    projects_count: 1,
    total_revenue: 67200,
    created_at: '2024-03-10T10:45:00Z'
  },
  {
    id: 'demo-client-4',
    company_name: 'FinanceFlow Inc',
    industry: 'Finance',
    status: 'prospect',
    primary_contact: {
      full_name: 'Robert Kim',
      email: 'robert.kim@financeflow.com',
      title: 'Director of Technology'
    },
    projects_count: 0,
    total_revenue: 0,
    created_at: '2024-06-05T16:20:00Z'
  },
  {
    id: 'demo-client-5',
    company_name: 'EduTech Innovations',
    industry: 'Education',
    website: 'https://edutech-innovations.org',
    status: 'active',
    primary_contact: {
      full_name: 'Lisa Thompson',
      email: 'lisa@edutech-innovations.org',
      phone: '+1 (555) 234-5678',
      title: 'Product Manager'
    },
    projects_count: 2,
    total_revenue: 52800,
    created_at: '2024-04-18T09:30:00Z'
  }
]

export const demoProjects: DemoProject[] = [
  {
    id: 'demo-project-1',
    name: 'Enterprise E-commerce Platform',
    description: 'Complete rebuild of legacy e-commerce system with modern React frontend, Node.js API, and PostgreSQL database. Includes inventory management, payment processing, and analytics dashboard.',
    status: 'active',
    client_company: 'TechCorp Solutions',
    start_date: '2024-03-01',
    end_date: '2024-08-15',
    estimated_hours: 480,
    hourly_rate: 150,
    github_repo_url: 'https://github.com/techcorp/ecommerce-platform',
    created_at: '2024-02-25T10:00:00Z',
    progress: 65
  },
  {
    id: 'demo-project-2',
    name: 'Customer Analytics Dashboard',
    description: 'Real-time analytics dashboard for tracking customer behavior, sales metrics, and business intelligence. Built with Next.js, D3.js visualizations, and integrated with existing CRM.',
    status: 'completed',
    client_company: 'TechCorp Solutions',
    start_date: '2024-01-15',
    end_date: '2024-03-30',
    estimated_hours: 240,
    hourly_rate: 150,
    fixed_price: 35000,
    github_repo_url: 'https://github.com/techcorp/analytics-dashboard',
    created_at: '2024-01-10T14:30:00Z',
    progress: 100
  },
  {
    id: 'demo-project-3',
    name: 'Mobile API & DevOps Setup',
    description: 'RESTful API development for mobile app backend with AWS infrastructure setup, CI/CD pipeline, monitoring, and security hardening.',
    status: 'completed',
    client_company: 'TechCorp Solutions',
    start_date: '2024-05-01',
    end_date: '2024-06-20',
    estimated_hours: 160,
    hourly_rate: 150,
    github_repo_url: 'https://github.com/techcorp/mobile-api',
    created_at: '2024-04-28T11:15:00Z',
    progress: 100
  },
  {
    id: 'demo-project-4',
    name: 'Sustainable Supply Chain Platform',
    description: 'Web platform for tracking and optimizing supply chain sustainability metrics. Features include vendor scorecards, environmental impact tracking, and automated reporting.',
    status: 'active',
    client_company: 'GreenLeaf Ventures',
    start_date: '2024-04-15',
    end_date: '2024-09-30',
    estimated_hours: 320,
    hourly_rate: 140,
    github_repo_url: 'https://github.com/greenleaf/supply-chain-platform',
    created_at: '2024-04-10T09:45:00Z',
    progress: 45
  },
  {
    id: 'demo-project-5',
    name: 'Inventory Management System',
    description: 'Custom inventory management system with barcode scanning, automated reordering, and integration with existing ERP system.',
    status: 'planning',
    client_company: 'GreenLeaf Ventures',
    start_date: '2024-08-01',
    estimated_hours: 200,
    hourly_rate: 140,
    created_at: '2024-07-20T13:20:00Z',
    progress: 5
  },
  {
    id: 'demo-project-6',
    name: 'Patient Data Analytics Platform',
    description: 'HIPAA-compliant healthcare analytics platform for processing patient data, generating insights, and creating automated reports for medical research.',
    status: 'active',
    client_company: 'HealthFirst Analytics',
    start_date: '2024-05-20',
    end_date: '2024-10-15',
    estimated_hours: 400,
    hourly_rate: 160,
    github_repo_url: 'https://github.com/healthfirst/patient-analytics',
    created_at: '2024-05-15T15:00:00Z',
    progress: 30
  },
  {
    id: 'demo-project-7',
    name: 'Learning Management System',
    description: 'Custom LMS with video streaming, interactive quizzes, progress tracking, and instructor tools. Integrated with payment processing and certificate generation.',
    status: 'completed',
    client_company: 'EduTech Innovations',
    start_date: '2024-02-01',
    end_date: '2024-05-30',
    estimated_hours: 280,
    hourly_rate: 135,
    fixed_price: 38000,
    github_repo_url: 'https://github.com/edutech/lms-platform',
    created_at: '2024-01-25T12:30:00Z',
    progress: 100
  },
  {
    id: 'demo-project-8',
    name: 'Student Portal Mobile App',
    description: 'React Native mobile application for students to access courses, submit assignments, view grades, and communicate with instructors.',
    status: 'on_hold',
    client_company: 'EduTech Innovations',
    start_date: '2024-06-15',
    estimated_hours: 180,
    hourly_rate: 135,
    created_at: '2024-06-10T10:15:00Z',
    progress: 15
  }
]

export const demoStats = {
  totalProjects: demoProjects.length,
  activeProjects: demoProjects.filter(p => p.status === 'active').length,
  totalHoursWorked: 1240, // Calculated from time entries
  outstandingInvoices: 3,
  totalRevenue: demoClients.reduce((sum, client) => sum + client.total_revenue, 0)
}

// Utility functions for demo data
export const generateTimeEntries = (projectId: string, totalHours: number): DemoTimeEntry[] => {
  const entries: DemoTimeEntry[] = []
  const startDate = new Date('2024-03-01')
  const endDate = new Date()
  
  let remainingHours = totalHours
  let currentDate = new Date(startDate)
  
  while (remainingHours > 0 && currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const hoursThisDay = Math.min(
        remainingHours,
        Math.floor(Math.random() * 8) + 1 // 1-8 hours per day
      )
      
      if (hoursThisDay > 0) {
        entries.push({
          id: `demo-time-${projectId}-${entries.length + 1}`,
          project_id: projectId,
          description: taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)],
          hours: hoursThisDay,
          date: currentDate.toISOString().split('T')[0],
          billable: Math.random() > 0.1, // 90% billable
          hourly_rate: 150
        })
        
        remainingHours -= hoursThisDay
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return entries
}

export const generateInvoices = (projects: DemoProject[]): DemoInvoice[] => {
  const invoices: DemoInvoice[] = []
  let invoiceCounter = 1001
  
  projects.forEach(project => {
    if (project.status === 'completed' || (project.status === 'active' && project.progress > 50)) {
      const amount = project.fixed_price || (project.estimated_hours * 0.7 * project.hourly_rate)
      const issuedDate = new Date(project.start_date)
      issuedDate.setMonth(issuedDate.getMonth() + 1)
      
      const dueDate = new Date(issuedDate)
      dueDate.setDate(dueDate.getDate() + 30)
      
      let status: DemoInvoice['status'] = 'sent'
      let paidDate: string | undefined
      
      if (project.status === 'completed') {
        status = 'paid'
        const tempPaidDate = new Date(dueDate)
        tempPaidDate.setDate(tempPaidDate.getDate() - 5)
        paidDate = tempPaidDate.toISOString().split('T')[0]
      } else if (dueDate < new Date()) {
        status = 'overdue'
      }
      
      invoices.push({
        id: `demo-invoice-${project.id}`,
        project_id: project.id,
        invoice_number: `INV-${invoiceCounter++}`,
        amount,
        status,
        issued_date: issuedDate.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        paid_date: paidDate
      })
    }
  })
  
  return invoices
}

// Export combined demo data
export const demoData = {
  clients: demoClients,
  projects: demoProjects,
  stats: demoStats,
  timeEntries: demoProjects.flatMap(p => 
    generateTimeEntries(p.id, Math.floor(p.estimated_hours * (p.progress / 100)))
  ),
  invoices: generateInvoices(demoProjects)
}