import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/server-database'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the specific project for this client's company
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('client_id', clientContact.client_company_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })

  } catch (error) {
    console.error('Error in GET /api/client/projects/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}