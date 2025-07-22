// Database types for Client Dashboard
// Generated from Supabase schema

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'moderator' | 'client' | 'team_member' | null
          company_name: string | null
          phone: string | null
          address: string | null
          timezone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator' | 'client' | 'team_member' | null
          company_name?: string | null
          phone?: string | null
          address?: string | null
          timezone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator' | 'client' | 'team_member' | null
          company_name?: string | null
          phone?: string | null
          address?: string | null
          timezone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          client_id: string | null
          github_repo_url: string | null
          github_repo_name: string | null
          github_default_branch: string | null
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | null
          start_date: string | null
          end_date: string | null
          estimated_hours: number | null
          hourly_rate: number | null
          fixed_price: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          client_id?: string | null
          github_repo_url?: string | null
          github_repo_name?: string | null
          github_default_branch?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | null
          start_date?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          hourly_rate?: number | null
          fixed_price?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          client_id?: string | null
          github_repo_url?: string | null
          github_repo_name?: string | null
          github_default_branch?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | null
          start_date?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          hourly_rate?: number | null
          fixed_price?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string | null
          user_id: string | null
          role: string | null
          can_track_time: boolean | null
          can_view_financials: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          role?: string | null
          can_track_time?: boolean | null
          can_view_financials?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          role?: string | null
          can_track_time?: boolean | null
          can_view_financials?: boolean | null
          created_at?: string | null
        }
      }
      time_entries: {
        Row: {
          id: string
          project_id: string | null
          user_id: string | null
          start_time: string | null
          end_time: string | null
          hours_worked: number
          description: string
          entry_type: 'development' | 'design' | 'meeting' | 'testing' | 'deployment' | 'consultation' | 'other' | null
          is_billable: boolean | null
          hourly_rate: number | null
          date_worked: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          start_time?: string | null
          end_time?: string | null
          hours_worked: number
          description: string
          entry_type?: 'development' | 'design' | 'meeting' | 'testing' | 'deployment' | 'consultation' | 'other' | null
          is_billable?: boolean | null
          hourly_rate?: number | null
          date_worked: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          start_time?: string | null
          end_time?: string | null
          hours_worked?: number
          description?: string
          entry_type?: 'development' | 'design' | 'meeting' | 'testing' | 'deployment' | 'consultation' | 'other' | null
          is_billable?: boolean | null
          hourly_rate?: number | null
          date_worked?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          project_id: string | null
          client_id: string | null
          invoice_number: string
          title: string
          description: string | null
          subtotal: number
          tax_rate: number | null
          tax_amount: number | null
          total_amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | null
          issue_date: string | null
          due_date: string | null
          sent_date: string | null
          paid_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          client_id?: string | null
          invoice_number: string
          title: string
          description?: string | null
          subtotal?: number
          tax_rate?: number | null
          tax_amount?: number | null
          total_amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | null
          issue_date?: string | null
          due_date?: string | null
          sent_date?: string | null
          paid_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          client_id?: string | null
          invoice_number?: string
          title?: string
          description?: string | null
          subtotal?: number
          tax_rate?: number | null
          tax_amount?: number | null
          total_amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | null
          issue_date?: string | null
          due_date?: string | null
          sent_date?: string | null
          paid_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      invoice_line_items: {
        Row: {
          id: string
          invoice_id: string | null
          description: string
          quantity: number | null
          unit_price: number
          total_price: number
          time_entry_ids: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          description: string
          quantity?: number | null
          unit_price: number
          total_price: number
          time_entry_ids?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string | null
          description?: string
          quantity?: number | null
          unit_price?: number
          total_price?: number
          time_entry_ids?: string[] | null
          created_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string | null
          amount: number
          method: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'crypto'
          transaction_id: string | null
          reference_number: string | null
          processor_name: string | null
          processor_fee: number | null
          net_amount: number | null
          payment_date: string | null
          processed_at: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          amount: number
          method: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'crypto'
          transaction_id?: string | null
          reference_number?: string | null
          processor_name?: string | null
          processor_fee?: number | null
          net_amount?: number | null
          payment_date?: string | null
          processed_at?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string | null
          amount?: number
          method?: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'crypto'
          transaction_id?: string | null
          reference_number?: string | null
          processor_name?: string | null
          processor_fee?: number | null
          net_amount?: number | null
          payment_date?: string | null
          processed_at?: string | null
          notes?: string | null
          created_at?: string | null
        }
      }
      github_webhook_events: {
        Row: {
          id: string
          project_id: string | null
          event_type: string
          commit_sha: string | null
          commit_message: string | null
          author_name: string | null
          author_email: string | null
          branch_name: string | null
          raw_payload: Record<string, any> | null
          processed: boolean | null
          processed_at: string | null
          event_timestamp: string
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          event_type: string
          commit_sha?: string | null
          commit_message?: string | null
          author_name?: string | null
          author_email?: string | null
          branch_name?: string | null
          raw_payload?: Record<string, any> | null
          processed?: boolean | null
          processed_at?: string | null
          event_timestamp: string
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          event_type?: string
          commit_sha?: string | null
          commit_message?: string | null
          author_name?: string | null
          author_email?: string | null
          branch_name?: string | null
          raw_payload?: Record<string, any> | null
          processed?: boolean | null
          processed_at?: string | null
          event_timestamp?: string
          created_at?: string | null
        }
      }
      project_updates: {
        Row: {
          id: string
          project_id: string | null
          author_id: string | null
          title: string
          content: string
          update_type: string | null
          visible_to_client: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          author_id?: string | null
          title: string
          content: string
          update_type?: string | null
          visible_to_client?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          author_id?: string | null
          title?: string
          content?: string
          update_type?: string | null
          visible_to_client?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
      invoice_status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
      payment_method: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'crypto'
      time_entry_type: 'development' | 'design' | 'meeting' | 'testing' | 'deployment' | 'consultation' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for common database operations
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type TimeEntry = Database['public']['Tables']['time_entries']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceLineItem = Database['public']['Tables']['invoice_line_items']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type GitHubEvent = Database['public']['Tables']['github_webhook_events']['Row']
export type ProjectUpdate = Database['public']['Tables']['project_updates']['Row']

// Insert types
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectMemberInsert = Database['public']['Tables']['project_members']['Insert']
export type TimeEntryInsert = Database['public']['Tables']['time_entries']['Insert']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceLineItemInsert = Database['public']['Tables']['invoice_line_items']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type GitHubEventInsert = Database['public']['Tables']['github_webhook_events']['Insert']
export type ProjectUpdateInsert = Database['public']['Tables']['project_updates']['Insert']

// Update types
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type ProjectUpdateType = Database['public']['Tables']['projects']['Update']
export type ProjectMemberUpdate = Database['public']['Tables']['project_members']['Update']
export type TimeEntryUpdate = Database['public']['Tables']['time_entries']['Update']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']
export type InvoiceLineItemUpdate = Database['public']['Tables']['invoice_line_items']['Update']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']
export type GitHubEventUpdate = Database['public']['Tables']['github_webhook_events']['Update']
export type ProjectUpdateUpdate = Database['public']['Tables']['project_updates']['Update']

// Enum types
export type ProjectStatus = Database['public']['Enums']['project_status']
export type InvoiceStatus = Database['public']['Enums']['invoice_status']
export type PaymentMethod = Database['public']['Enums']['payment_method']
export type TimeEntryType = Database['public']['Enums']['time_entry_type']
export type UserRole = 'user' | 'admin' | 'moderator' | 'client' | 'team_member'

// Extended types with relations for common queries
export interface ProjectWithClient extends Project {
  client: UserProfile | null
}

export interface ProjectWithMembers extends Project {
  project_members: (ProjectMember & {
    user_profiles: UserProfile | null
  })[]
}

export interface TimeEntryWithProject extends TimeEntry {
  projects: Project | null
}

export interface InvoiceWithProject extends Invoice {
  projects: Project | null
  user_profiles: UserProfile | null
}

export interface InvoiceWithLineItems extends Invoice {
  invoice_line_items: InvoiceLineItem[]
}

export interface PaymentWithInvoice extends Payment {
  invoices: Invoice | null
}

export interface ProjectUpdateWithAuthor extends ProjectUpdate {
  author: UserProfile | null
}

export interface GitHubEventWithProject extends GitHubEvent {
  projects: Project | null
}