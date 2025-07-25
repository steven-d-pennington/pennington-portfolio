import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function GET(request: NextRequest) {
  try {
    // Get all active client companies with their primary contact
    const { data: companies, error } = await supabaseAdmin
      .from('client_companies')
      .select(`
        id,
        company_name,
        status,
        industry,
        website,
        created_at,
        client_contacts!client_contacts_client_company_id_fkey (
          id,
          full_name,
          email,
          is_primary_contact
        )
      `)
      .eq('status', 'active')
      .order('company_name')

    if (error) {
      console.error('Error fetching client companies:', error)
      return NextResponse.json({ error: 'Failed to fetch client companies' }, { status: 500 })
    }

    // Format the response to include primary contact info
    const formattedCompanies = (companies || []).map(company => ({
      id: company.id,
      company_name: company.company_name,
      status: company.status,
      industry: company.industry,
      website: company.website,
      created_at: company.created_at,
      primary_contact: (company.client_contacts as any[])?.find(contact => contact.is_primary_contact) || null
    }))

    return NextResponse.json({ companies: formattedCompanies })

  } catch (error) {
    console.error('Error in GET /api/client-companies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}