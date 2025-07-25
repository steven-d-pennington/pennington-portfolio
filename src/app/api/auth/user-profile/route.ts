import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'
import type { UnifiedUser, ClientRole, TeamRole } from '@/types/auth'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // First check if user is a client contact
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from('client_contacts')
      .select(`
        *,
        client_companies:client_company_id (
          id,
          company_name,
          status
        )
      `)
      .eq('id', userId)
      .single()

    if (clientData && !clientError) {
      // User is a client contact
      const user: UnifiedUser = {
        id: clientData.id,
        email: clientData.email,
        full_name: clientData.full_name,
        userType: 'client',
        role: clientData.role as ClientRole,
        client_company_id: clientData.client_company_id,
        client_company: clientData.client_companies,
        phone: clientData.phone,
        title: clientData.title,
        department: clientData.department,
        is_primary_contact: clientData.is_primary_contact,
        is_billing_contact: clientData.is_billing_contact,
        can_manage_team: clientData.can_manage_team,
        created_at: clientData.created_at,
        updated_at: clientData.updated_at
      }
      
      return NextResponse.json({ user })
    }

    // Check if user is a team member
    const { data: teamData, error: teamError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (teamData && !teamError) {
      // User is a team member
      const user: UnifiedUser = {
        id: teamData.id,
        email: teamData.email || '',
        full_name: teamData.full_name,
        userType: 'team',
        role: teamData.role as TeamRole,
        avatar_url: teamData.avatar_url,
        status: teamData.status,
        created_at: teamData.created_at,
        updated_at: teamData.updated_at
      }
      
      return NextResponse.json({ user })
    }

    // User not found in either table
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}