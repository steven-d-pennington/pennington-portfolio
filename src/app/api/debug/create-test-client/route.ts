import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'
import { supabase } from '@/utils/supabase'

export async function POST() {
  try {
    // First try to get existing auth user, or create new one
    let userId: string
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers.users.find(u => u.email === 'client@monkeylovestack.com')
    
    if (existingUser) {
      userId = existingUser.id
      console.log('Using existing auth user:', existingUser.email)
    } else {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: 'client@monkeylovestack.com',
        password: 'testpass123',
        email_confirm: true
      })

      if (authError) {
        console.error('Auth user creation failed:', authError)
        return NextResponse.json({ error: 'Failed to create auth user', details: authError }, { status: 500 })
      }

      userId = authUser.user.id
    }

    // Create client company first
    const { data: clientCompany, error: companyError } = await supabaseAdmin
      .from('client_companies')
      .upsert([
        {
          company_name: 'Test Company Inc',
          email: 'client@monkeylovestack.com',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single()

    if (companyError) {
      console.error('Company creation failed:', companyError)
      return NextResponse.json({ error: 'Failed to create company', details: companyError }, { status: 500 })
    }

    // Create client contact
    const { data: clientContact, error: contactError } = await supabaseAdmin
      .from('client_contacts')
      .upsert([
        {
          id: userId,
          full_name: 'Test Client User',
          email: 'client@monkeylovestack.com',
          role: 'owner',
          can_manage_team: true,
          client_company_id: clientCompany.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (contactError) {
      console.error('Contact creation failed:', contactError)
      return NextResponse.json({ error: 'Failed to create contact', details: contactError }, { status: 500 })
    }

    // Create a test project for this client
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .upsert([
        {
          name: 'Test Project for Client',
          description: 'This is a test project for the client portal demo',
          status: 'active',
          client_id: clientCompany.id,
          start_date: new Date().toISOString(),
          estimated_hours: 40,
          hourly_rate: 100.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (projectError) {
      console.error('Project creation failed:', projectError)
      return NextResponse.json({ error: 'Failed to create project', details: projectError }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test client data created successfully',
      data: {
        authUser: 'client@monkeylovestack.com',
        clientCompany: clientCompany,
        clientContact: clientContact,
        project: project
      }
    })

  } catch (error) {
    console.error('Error creating test client:', error)
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 })
  }
}