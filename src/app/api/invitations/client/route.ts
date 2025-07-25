import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
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
    
    // Verify admin user (use getUser instead of getSession for security)
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify admin role
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || !['admin', 'moderator'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      email, 
      full_name, 
      phone, 
      title, 
      department,
      role,
      client_company_id,
      is_primary_contact,
      is_billing_contact,
      can_manage_team
    } = body

    // Validate required fields
    if (!email || !full_name || !client_company_id) {
      return NextResponse.json({ 
        error: 'Email, full name, and client company are required' 
      }, { status: 400 })
    }

    // Check if client company exists
    const { data: clientCompany, error: companyError } = await supabaseAdmin
      .from('client_companies')
      .select('id, company_name, status')
      .eq('id', client_company_id)
      .single()

    if (companyError || !clientCompany) {
      return NextResponse.json({ error: 'Client company not found' }, { status: 404 })
    }

    if (clientCompany.status !== 'active') {
      return NextResponse.json({ error: 'Client company is not active' }, { status: 400 })
    }

    // Check if email already has an invitation
    const { data: existingInvitation } = await supabaseAdmin
      .from('user_invitations')
      .select('id, status')
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (existingInvitation) {
      return NextResponse.json({ 
        error: 'An active invitation already exists for this email' 
      }, { status: 409 })
    }

    // Check if user already exists in our system by checking if they have a user_profiles or client_contacts record
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    const { data: existingContact } = await supabaseAdmin
      .from('client_contacts')
      .select('id')
      .eq('email', email)
      .single()
    
    if (existingProfile || existingContact) {
      return NextResponse.json({ 
        error: 'A user with this email already exists' 
      }, { status: 409 })
    }

    // Generate invitation token as UUID
    const invitationToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const invitationData = {
      email,
      full_name,
      role: 'client',
      company_name: clientCompany.company_name,
      phone: phone || null,
      invited_by: user.id,
      invitation_token: invitationToken,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
      timezone: 'UTC' // Default timezone
    }

    console.log('Creating invitation with data:', invitationData)

    // Create invitation record with client-specific metadata
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('user_invitations')
      .insert(invitationData)
      .select()
      .single()

    if (invitationError) {
      console.error('Error creating invitation:', invitationError)
      return NextResponse.json({ 
        error: 'Failed to create invitation', 
        details: invitationError.message 
      }, { status: 500 })
    }

    // Store client-specific metadata in a separate record or extend the invitation
    // For now, we'll store the additional client contact data when the invitation is accepted
    // This could be optimized by adding client-specific fields to user_invitations table

    // TODO: Send invitation email
    // In a real implementation, you would send an email here with the invitation link
    console.log(`Invitation created for ${email} with token ${invitationToken}`)
    console.log(`Invitation URL: ${process.env.NEXT_PUBLIC_SITE_URL}/accept-invitation?token=${invitationToken}`)

    return NextResponse.json({ 
      invitation: {
        id: invitation.id,
        email: invitation.email,
        full_name: invitation.full_name,
        company_name: invitation.company_name,
        expires_at: invitation.expires_at,
        status: invitation.status,
        invitation_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/accept-invitation?token=${invitationToken}`
      }
    })

  } catch (error) {
    console.error('Error in POST /api/invitations/client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    
    // Verify admin user (use getUser instead of getSession for security)
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify admin role
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || !['admin', 'moderator'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all client invitations
    const { data: invitations, error } = await supabaseAdmin
      .from('user_invitations')
      .select(`
        id,
        email,
        full_name,
        company_name,
        phone,
        status,
        expires_at,
        created_at,
        accepted_at,
        user_profiles!user_invitations_invited_by_fkey (
          full_name,
          email
        )
      `)
      .eq('role', 'client')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching client invitations:', error)
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 })
    }

    return NextResponse.json({ invitations })

  } catch (error) {
    console.error('Error in GET /api/invitations/client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}