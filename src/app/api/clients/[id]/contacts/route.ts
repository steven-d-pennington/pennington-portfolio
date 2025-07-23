import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';
import type { ClientContactInsert } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch all contacts for this company
    const { data: contacts, error } = await supabaseAdmin
      .from('client_contacts')
      .select('*')
      .eq('client_company_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching client contacts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch client contacts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ contacts });

  } catch (error) {
    console.error('Unexpected error in GET /api/clients/[id]/contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json() as Omit<ClientContactInsert, 'client_company_id'>;
    
    // Validate required fields
    if (!body.full_name || !body.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists as a client contact
    const { data: existingContact } = await supabaseAdmin
      .from('client_contacts')
      .select('id, client_company_id')
      .eq('email', body.email)
      .single();

    if (existingContact) {
      return NextResponse.json(
        { error: 'A client contact with this email already exists' },
        { status: 409 }
      );
    }

    // Verify the company exists
    const { data: company, error: companyError } = await supabaseAdmin
      .from('client_companies')
      .select('id')
      .eq('id', id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Client company not found' },
        { status: 404 }
      );
    }

    // Create the new contact
    const { data: newContact, error: contactError } = await supabaseAdmin
      .from('client_contacts')
      .insert({
        ...body,
        client_company_id: id,
        role: body.role || 'member',
        is_primary_contact: body.is_primary_contact || false,
        is_billing_contact: body.is_billing_contact || false,
        can_manage_team: body.can_manage_team || false
      })
      .select()
      .single();

    if (contactError) {
      console.error('Error creating client contact:', contactError);
      return NextResponse.json(
        { error: 'Failed to create client contact' },
        { status: 500 }
      );
    }

    console.log(`Created new client contact: ${body.full_name} for company ${id}`);

    return NextResponse.json({ 
      message: 'Client contact created successfully',
      contact: newContact
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/clients/[id]/contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}