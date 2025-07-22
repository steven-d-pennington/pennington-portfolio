import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';
import type { ClientCompanyUpdate, ClientCompanyWithOwner } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch company
    const { data: company, error } = await supabaseAdmin
      .from('client_companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client company:', error);
      return NextResponse.json(
        { error: 'Client company not found' },
        { status: 404 }
      );
    }

    // Fetch owner contact separately
    let ownerContact = null;
    if (company.owner_contact_id) {
      const { data: owner } = await supabaseAdmin
        .from('client_contacts')
        .select('*')
        .eq('id', company.owner_contact_id)
        .single();
      ownerContact = owner;
    }

    const enrichedCompany = {
      ...company,
      owner_contact: ownerContact
    };

    return NextResponse.json({ company: enrichedCompany });

  } catch (error) {
    console.error('Unexpected error in GET /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json() as ClientCompanyUpdate;
    
    // Update the company
    const { data: updatedCompany, error: updateError } = await supabaseAdmin
      .from('client_companies')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating client company:', updateError);
      return NextResponse.json(
        { error: 'Failed to update client company' },
        { status: 500 }
      );
    }

    // Fetch owner contact separately
    let ownerContact = null;
    if (updatedCompany.owner_contact_id) {
      const { data: owner } = await supabaseAdmin
        .from('client_contacts')
        .select('*')
        .eq('id', updatedCompany.owner_contact_id)
        .single();
      ownerContact = owner;
    }

    const enrichedCompany = {
      ...updatedCompany,
      owner_contact: ownerContact
    };

    return NextResponse.json({ 
      message: 'Client company updated successfully',
      company: enrichedCompany
    });

  } catch (error) {
    console.error('Unexpected error in PATCH /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if company has associated projects
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('client_company_id', id)
      .limit(1);

    if (projectsError) {
      console.error('Error checking for associated projects:', projectsError);
      return NextResponse.json(
        { error: 'Failed to check for associated projects' },
        { status: 500 }
      );
    }

    if (projects && projects.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete client company with associated projects' },
        { status: 409 }
      );
    }

    // Delete the company (this will cascade to delete contacts due to foreign key)
    const { error: deleteError } = await supabaseAdmin
      .from('client_companies')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting client company:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete client company' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Client company deleted successfully' 
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}