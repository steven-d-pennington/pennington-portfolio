import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';

export async function GET(request: NextRequest) {
  try {
    // Get all user profiles
    const { data: users, error: usersError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Calculate stats
    const stats = {
      totalUsers: users.length,
      activeUsers: users.length, // For now, assume all users are active
      clientUsers: users.filter(u => u.role === 'client').length,
      teamMembers: users.filter(u => u.role === 'team_member').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
    };

    return NextResponse.json({
      users,
      stats
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name, role, company_name, phone, address, timezone } = body;

    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // For now, we'll create a user profile without creating an auth user
    // In a real app, you'd want to create the auth user first or send an invitation
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('user_profiles')
      .insert([
        {
          email,
          full_name,
          role: role || 'user',
          company_name: company_name || null,
          phone: phone || null,
          address: address || null,
          timezone: timezone || 'UTC',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}