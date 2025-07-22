import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds, updates } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs array is required' },
        { status: 400 }
      );
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      );
    }

    // Validate userIds are valid UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = userIds.filter(id => typeof id !== 'string' || !uuidRegex.test(id));
    
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: 'Invalid user IDs provided' },
        { status: 400 }
      );
    }

    // Check that all users exist
    const { data: existingUsers, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, role')
      .in('id', userIds);

    if (fetchError) {
      console.error('Error fetching users for bulk update:', fetchError);
      return NextResponse.json(
        { error: 'Failed to validate users' },
        { status: 500 }
      );
    }

    if (!existingUsers || existingUsers.length !== userIds.length) {
      return NextResponse.json(
        { error: 'Some users were not found' },
        { status: 404 }
      );
    }

    // Special handling for role updates
    if (updates.role) {
      // If trying to remove admin role, check we're not removing all admins
      const adminUsers = existingUsers.filter(u => u.role === 'admin');
      const nonAdminRoleUpdate = updates.role !== 'admin';
      
      if (nonAdminRoleUpdate && adminUsers.length > 0) {
        // Check total admin count
        const { count: totalAdmins } = await supabaseAdmin
          .from('user_profiles')
          .select('id', { count: 'exact' })
          .eq('role', 'admin');

        // If we're changing all remaining admins to non-admin roles
        if (totalAdmins && totalAdmins <= adminUsers.length) {
          return NextResponse.json(
            { error: 'Cannot remove admin role from all admin users' },
            { status: 400 }
          );
        }
      }
    }

    // Prepare update data
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Perform bulk update
    const { data: updatedUsers, error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .in('id', userIds)
      .select();

    if (updateError) {
      console.error('Error performing bulk update:', updateError);
      return NextResponse.json(
        { error: 'Failed to update users' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: `Successfully updated ${updatedUsers.length} users`,
      users: updatedUsers 
    });

  } catch (error) {
    console.error('Unexpected error in PATCH /api/users/bulk-update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}