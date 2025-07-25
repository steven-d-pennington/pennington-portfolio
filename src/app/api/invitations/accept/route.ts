import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Invitation token and password are required' 
      }, { status: 400 })
    }

    // Find the invitation
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('user_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .single()

    if (invitationError || !invitation) {
      return NextResponse.json({ 
        error: 'Invalid or expired invitation token' 
      }, { status: 404 })
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Mark invitation as expired
      await supabaseAdmin
        .from('user_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id)

      return NextResponse.json({ 
        error: 'Invitation has expired' 
      }, { status: 410 })
    }

    // Create the user account
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true, // Auto-confirm email since they were invited
      user_metadata: {
        full_name: invitation.full_name,
        role: invitation.role
      }
    })

    if (authError || !authUser.user) {
      console.error('Error creating user:', authError)
      return NextResponse.json({ 
        error: 'Failed to create user account' 
      }, { status: 500 })
    }

    try {
      // Handle different invitation types
      if (invitation.role === 'client') {
        // For client invitations, we need to create a client_contacts record
        // First, find the client company by name (this could be improved with better metadata storage)
        const { data: clientCompany, error: companyError } = await supabaseAdmin
          .from('client_companies')
          .select('id')
          .eq('company_name', invitation.company_name)
          .single()

        if (companyError || !clientCompany) {
          // Cleanup the auth user if we can't create the client contact
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
          return NextResponse.json({ 
            error: 'Client company not found' 
          }, { status: 404 })
        }

        // Create client contact record
        const { error: contactError } = await supabaseAdmin
          .from('client_contacts')
          .insert({
            id: authUser.user.id,
            client_company_id: clientCompany.id,
            full_name: invitation.full_name,
            email: invitation.email,
            phone: invitation.phone,
            role: 'member', // Default role, can be updated later
            is_primary_contact: false,
            is_billing_contact: false,
            can_manage_team: false
          })

        if (contactError) {
          console.error('Error creating client contact:', contactError)
          // Cleanup the auth user
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
          return NextResponse.json({ 
            error: 'Failed to create client contact record' 
          }, { status: 500 })
        }
      } else {
        // For regular user invitations, create user_profiles record
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: authUser.user.id,
            email: invitation.email,
            full_name: invitation.full_name,
            role: invitation.role,
            company_name: invitation.company_name,
            phone: invitation.phone,
            timezone: invitation.timezone || 'UTC'
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Cleanup the auth user
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
          return NextResponse.json({ 
            error: 'Failed to create user profile' 
          }, { status: 500 })
        }
      }

      // Mark invitation as accepted
      await supabaseAdmin
        .from('user_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id)

      return NextResponse.json({ 
        success: true,
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
          role: invitation.role
        }
      })

    } catch (error) {
      console.error('Error in post-signup setup:', error)
      // Cleanup the auth user if setup failed
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ 
        error: 'Failed to complete account setup' 
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error in POST /api/invitations/accept:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        error: 'Invitation token is required' 
      }, { status: 400 })
    }

    // Find and validate the invitation
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('user_invitations')
      .select('id, email, full_name, role, company_name, expires_at, status')
      .eq('invitation_token', token)
      .single()

    if (invitationError || !invitation) {
      return NextResponse.json({ 
        error: 'Invalid invitation token' 
      }, { status: 404 })
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Invitation is no longer valid' 
      }, { status: 410 })
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Mark invitation as expired
      await supabaseAdmin
        .from('user_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id)

      return NextResponse.json({ 
        error: 'Invitation has expired' 
      }, { status: 410 })
    }

    return NextResponse.json({ 
      invitation: {
        email: invitation.email,
        full_name: invitation.full_name,
        role: invitation.role,
        company_name: invitation.company_name,
        expires_at: invitation.expires_at
      }
    })

  } catch (error) {
    console.error('Error in GET /api/invitations/accept:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}