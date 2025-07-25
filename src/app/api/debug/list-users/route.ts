import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function GET() {
  try {
    // List auth users
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    
    // List client companies
    const { data: companies } = await supabaseAdmin
      .from('client_companies')
      .select('*')
    
    // List client contacts
    const { data: contacts } = await supabaseAdmin
      .from('client_contacts')
      .select('*')

    return NextResponse.json({ 
      authUsers: authUsers.users.slice(0, 5), // limit to first 5
      companies,
      contacts
    })

  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}