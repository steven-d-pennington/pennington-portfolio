'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface ClientContact {
  id: string
  full_name: string
  email: string
  role: string
  can_manage_team: boolean
  client_company_id: string
  client_companies: {
    id: string
    company_name: string
    status: string
  }
}

interface ClientAuthContextType {
  user: User | null
  clientContact: ClientContact | null
  loading: boolean
  session: Session | null
}

const ClientAuthContext = createContext<ClientAuthContextType>({
  user: null,
  clientContact: null,
  loading: true,
  session: null
})

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [clientContact, setClientContact] = useState<ClientContact | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [loadingClientContact, setLoadingClientContact] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadClientContact(session)
      } else {
        setLoading(false)
      }
    })

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        setLoading(true)
        await loadClientContact(session)
      } else {
        setClientContact(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadClientContact = async (session: Session) => {
    // Prevent duplicate loading
    if (loadingClientContact) {
      return
    }

    try {
      setLoadingClientContact(true)
      const response = await fetch('/api/client/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      })

      if (response.ok) {
        const { clientContact } = await response.json()
        setClientContact(clientContact)
      } else {
        setClientContact(null)
      }
    } catch (error) {
      console.error('Error loading client contact:', error)
      setClientContact(null)
    } finally {
      setLoadingClientContact(false)
      setLoading(false)
    }
  }

  return (
    <ClientAuthContext.Provider value={{ user, clientContact, loading, session }}>
      {children}
    </ClientAuthContext.Provider>
  )
}

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext)
  if (!context) {
    throw new Error('useClientAuth must be used within ClientAuthProvider')
  }
  return context
}