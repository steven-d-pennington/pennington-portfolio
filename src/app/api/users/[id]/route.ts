import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/server-database';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const userId = params.id;
    
    // Create server client for session verification
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Verify user session
    const { data: { session }, error: sessionError } = await supabaseServer.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get current user profile to check privileges
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Check if user can access this profile (admin or own profile)
    const isAdmin = currentUser.role === 'admin';
    const isOwnProfile = session.user.id === userId;

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Unexpected error in GET /api/users/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { email, full_name, role, company_name, phone, address, timezone } = body;

    // Validate required fields
    if (email !== undefined && !email) {
      return NextResponse.json(
        { error: 'Email cannot be empty' },
        { status: 400 }
      );
    }

    if (full_name !== undefined && !full_name) {
      return NextResponse.json(
        { error: 'Full name cannot be empty' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If email is being changed, check for conflicts
    if (email && email !== existingUser.email) {
      const { data: emailConflict } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .neq('id', userId)
        .single();

      if (emailConflict) {
        return NextResponse.json(
          { error: 'Email is already in use by another user' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (email !== undefined) updateData.email = email;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (role !== undefined) updateData.role = role;
    if (company_name !== undefined) updateData.company_name = company_name || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address !== undefined) updateData.address = address || null;
    if (timezone !== undefined) updateData.timezone = timezone || null;

    // Update user
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    console.error('Unexpected error in PATCH /api/users/[id]:', error);
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
    const userId = params.id;

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of admin users (safety check)
    if (existingUser.role === 'admin') {
      // Count total admin users
      const { count: adminCount } = await supabaseAdmin
        .from('user_profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'admin');

      if (adminCount && adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      }
    }

    // In a production app, you'd want to:
    // 1. Check for dependent records (projects, time entries, etc.)
    // 2. Either cascade delete or transfer ownership
    // 3. Delete the auth user as well
    
    // For now, we'll just delete the profile
    const { error: deleteError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}