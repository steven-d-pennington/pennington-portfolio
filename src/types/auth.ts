// Unified Authentication Types
export type UserType = 'team' | 'client'

export type TeamRole = 'admin' | 'team_member' | 'moderator'
export type ClientRole = 'owner' | 'tech' | 'media' | 'finance' | 'member'

export interface BaseUser {
  id: string
  email: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface TeamUser extends BaseUser {
  userType: 'team'
  role: TeamRole
  avatar_url?: string
  status?: 'active' | 'inactive'
}

export interface ClientUser extends BaseUser {
  userType: 'client'
  role: ClientRole
  client_company_id: string
  client_company?: {
    id: string
    company_name: string
    status: string
  }
  phone?: string
  title?: string
  department?: string
  avatar_url?: string
  is_primary_contact: boolean
  is_billing_contact: boolean
  can_manage_team: boolean
}

export type UnifiedUser = TeamUser | ClientUser

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at: number
  user: UnifiedUser
}

export interface AuthContextType {
  user: UnifiedUser | null
  session: AuthSession | null
  loading: boolean
  
  // Authentication actions
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, options?: { data?: Record<string, unknown> }) => Promise<{ error?: string; data?: any }>
  resetPassword: (email: string) => Promise<{ error?: string }>
  signOut: () => Promise<{ error?: string }>
  refreshSession: () => Promise<{ error?: string }>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error?: string }>
  
  // User type helpers
  isTeamUser: () => boolean
  isClientUser: () => boolean
  hasRole: (role: TeamRole | ClientRole) => boolean
  canAccess: (resource: string) => boolean
}

// Route access definitions
export const ROUTE_ACCESS = {
  // Public routes (no auth required)
  public: ['/', '/about', '/contact', '/services', '/case-studies'],
  
  // Team-only routes
  team: ['/dashboard', '/dashboard/projects', '/dashboard/clients', '/dashboard/users'],
  
  // Client-only routes  
  client: ['/client/portal', '/client/portal/projects'],
  
  // Admin-only team routes
  admin: ['/dashboard/users', '/dashboard/clients', '/dashboard/settings'],
  
  // Owner/Manager client routes
  clientManager: ['/client/portal/team', '/client/portal/billing']
} as const

export type RouteCategory = keyof typeof ROUTE_ACCESS