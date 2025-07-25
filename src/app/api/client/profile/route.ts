import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/server-database'
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

    // Get client contact using admin client (bypasses RLS)
    const { data: clientContact, error: contactError } = await supabaseAdmin
      .from('client_contacts')
      .select(`
        id,
        full_name,
        email,
        role,
        can_manage_team,
        client_company_id,
        client_companies!client_contacts_client_company_id_fkey (
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

    return NextResponse.json({ clientContact })

  } catch (error) {
    console.error('Error in GET /api/client/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}