import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin, getProjectsByClient } from '@/lib/server-database'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Create server client for session verification
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    
    // Verify user session
    const { data: { session }, error: sessionError } = await supabaseServer.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get client contact to verify they're authorized and get their company ID
    const { data: clientContact, error: contactError } = await supabaseAdmin
      .from('client_contacts')
      .select(`
        id,
        client_company_id,
        client_companies:client_company_id (
          id,
          company_name,
          status
        )
      `)
      .eq('id', session.user.id)
      .single()

    if (contactError || !clientContact) {
      return NextResponse.json({ error: 'Client contact not found' }, { status: 404 })
    }

    // Verify company is active (handle both single object and array cases)
    const company = Array.isArray(clientContact.client_companies) 
      ? clientContact.client_companies[0] 
      : clientContact.client_companies
    
    if (company?.status !== 'active') {
      return NextResponse.json({ error: 'Company account is not active' }, { status: 403 })
    }

    // Get projects for this client's company
    const projects = await getProjectsByClient(clientContact.client_company_id)

    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Error in GET /api/client/projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}