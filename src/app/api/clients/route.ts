import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';
import type { 
  ClientCompany, 
  ClientContact, 
  CreateClientCompanyWithOwnerForm,
  ClientCompanyWithOwner 
} from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    // Note: This endpoint should only be accessible to admin/team_member users
    // Access control is handled by RLS policies

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeContacts = searchParams.get('include_contacts') === 'true';

    // Build query for client companies (simplified to avoid join issues)
    let query = supabaseAdmin
      .from('client_companies')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: companies, error } = await query;

    if (error) {
      console.error('Error fetching client companies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch client companies' },
        { status: 500 }
      );
    }

    // Fetch owner contacts separately to avoid join issues
    const companiesWithOwners = await Promise.all(
      companies.map(async (company) => {
        if (company.owner_contact_id) {
          const { data: ownerContact } = await supabaseAdmin
            .from('client_contacts')
            .select('*')
            .eq('id', company.owner_contact_id)
            .single();
          
          return {
            ...company,
            owner_contact: ownerContact
          };
        }
        return {
          ...company,
          owner_contact: null
        };
      })
    );

    // Get stats
    const { data: statsData } = await supabaseAdmin
      .from('client_companies')
      .select('status');

    const stats = statsData?.reduce((acc, company) => {
      acc[company.status] = (acc[company.status] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || { total: 0, active: 0, inactive: 0, prospect: 0 };

    return NextResponse.json({
      companies: companiesWithOwners,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Note: This endpoint should only be accessible to admin/team_member users
    // Access control is handled by RLS policies

    const body = await request.json() as CreateClientCompanyWithOwnerForm;
    const { 
      company_name, 
      industry, 
      website, 
      address, 
      phone, 
      email, 
      billing_address, 
      tax_id, 
      status = 'active',
      owner_full_name,
      owner_email,
      owner_phone,
      owner_title,
      owner_department
    } = body;

    // Validate required fields
    if (!company_name || !owner_full_name || !owner_email) {
      return NextResponse.json(
        { error: 'Company name, owner name, and owner email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(owner_email)) {
      return NextResponse.json(
        { error: 'Invalid owner email format' },
        { status: 400 }
      );
    }

    // Check if owner email already exists as a client contact
    const { data: existingContact } = await supabaseAdmin
      .from('client_contacts')
      .select('id, client_company_id')
      .eq('email', owner_email)
      .single();

    if (existingContact) {
      return NextResponse.json(
        { error: 'A client contact with this email already exists' },
        { status: 409 }
      );
    }

    // Start transaction-like operation
    // 1. Create company first (without owner_contact_id)
    const { data: newCompany, error: companyError } = await supabaseAdmin
      .from('client_companies')
      .insert({
        company_name,
        industry: industry || null,
        website: website || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        billing_address: billing_address || null,
        tax_id: tax_id || null,
        status,
        // owner_contact_id will be set after creating the contact
      })
      .select()
      .single();

    if (companyError || !newCompany) {
      console.error('Error creating company:', companyError);
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      );
    }

    // 2. Create owner contact
    const { data: newOwnerContact, error: contactError } = await supabaseAdmin
      .from('client_contacts')
      .insert({
        client_company_id: newCompany.id,
        full_name: owner_full_name,
        email: owner_email,
        phone: owner_phone || null,
        title: owner_title || null,
        department: owner_department || null,
        role: 'owner',
        is_primary_contact: true,
        can_manage_team: true, // Automatically set by trigger, but being explicit
      })
      .select()
      .single();

    if (contactError || !newOwnerContact) {
      console.error('Error creating owner contact:', contactError);
      
      // Clean up: delete the company we just created
      await supabaseAdmin
        .from('client_companies')
        .delete()
        .eq('id', newCompany.id);

      return NextResponse.json(
        { error: 'Failed to create owner contact' },
        { status: 500 }
      );
    }

    // 3. Update company with owner_contact_id
    const { error: updateError } = await supabaseAdmin
      .from('client_companies')
      .update({ 
        owner_contact_id: newOwnerContact.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', newCompany.id);

    if (updateError) {
      console.error('Error updating company with owner contact:', updateError);
      
      // Clean up: delete both records
      await supabaseAdmin.from('client_contacts').delete().eq('id', newOwnerContact.id);
      await supabaseAdmin.from('client_companies').delete().eq('id', newCompany.id);

      return NextResponse.json(
        { error: 'Failed to link owner to company' },
        { status: 500 }
      );
    }

    // 4. Fetch the complete created company with owner contact
    const { data: completedCompany, error: fetchError } = await supabaseAdmin
      .from('client_companies')
      .select('*')
      .eq('id', newCompany.id)
      .single();

    if (fetchError) {
      console.error('Error fetching completed company:', fetchError);
      return NextResponse.json(
        { error: 'Company created but failed to fetch details' },
        { status: 500 }
      );
    }

    // Add owner contact separately
    const enrichedCompany = {
      ...completedCompany,
      owner_contact: newOwnerContact
    };

    console.log(`Created new client company: ${company_name} with owner: ${owner_full_name}`);

    return NextResponse.json({ 
      message: 'Client company created successfully',
      company: enrichedCompany
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}