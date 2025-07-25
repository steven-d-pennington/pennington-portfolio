import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    console.log(`🧪 Testing authentication for: ${email}`)

    // Test authentication
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed: ' + authError.message,
        email
      })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'No user returned from authentication',
        email
      })
    }

    // Check if user is a client contact
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
      .eq('id', authData.user.id)
      .single()

    if (clientData && !clientError) {
      // User is a client contact
      return NextResponse.json({
        success: true,
        userType: 'client',
        user: {
          id: clientData.id,
          email: clientData.email,
          full_name: clientData.full_name,
          role: clientData.role,
          client_company_id: clientData.client_company_id,
          client_company: clientData.client_companies,
          can_manage_team: clientData.can_manage_team,
          expected_redirect: '/client-dashboard'
        }
      })
    }

    // Check if user is a team member
    const { data: teamData, error: teamError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (teamData && !teamError) {
      // User is a team member
      return NextResponse.json({
        success: true,
        userType: 'team',
        user: {
          id: teamData.id,
          email: teamData.email,
          full_name: teamData.full_name,
          role: teamData.role,
          avatar_url: teamData.avatar_url,
          status: teamData.status,
          expected_redirect: '/dashboard'
        }
      })
    }

    // User not found in either table
    return NextResponse.json({
      success: false,
      error: 'User profile not found in either client_contacts or user_profiles',
      email,
      authUserId: authData.user.id
    })

  } catch (error) {
    console.error('Error testing auth:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}