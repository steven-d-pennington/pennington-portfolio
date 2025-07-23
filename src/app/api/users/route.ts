import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/server-database';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);
    
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
    
    // Verify user session and admin privileges
    const { data: { session }, error: sessionError } = await supabaseServer.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get current user profile to check admin privileges
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse query parameters for filtering
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query for internal users (exclude clients - they're managed separately)
    let query = supabaseAdmin
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        role,
        company_name,
        phone,
        address,
        timezone,
        created_at,
        updated_at
      `, { count: 'exact' })
      .in('role', ['user', 'admin', 'moderator', 'team_member']); // Exclude 'client' role

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: users, error: usersError, count } = await query;

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Calculate stats (only for internal users)
    const stats = {
      totalUsers: count || 0,
      activeUsers: count || 0, // For now, assume all users are active
      clientUsers: 0, // Clients are managed separately
      teamMembers: users?.filter(u => u.role === 'team_member').length || 0,
      adminUsers: users?.filter(u => u.role === 'admin').length || 0,
    };

    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats,
      filters: { role, search }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
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
    
    // Verify user session and admin privileges
    const { data: { session }, error: sessionError } = await supabaseServer.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get current user profile to check admin privileges
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError || !currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      email, 
      full_name, 
      role = 'user',
      company_name,
      phone,
      address,
      timezone = 'UTC',
      send_invitation = true
    } = body;

    // Validate required fields
    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    // Validate role - exclude 'client' role as clients are managed separately
    const validRoles = ['user', 'admin', 'moderator', 'team_member'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    if (send_invitation) {
      // Send invitation via Supabase Auth (recommended approach)
      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name,
          role,
          company_name: company_name || null,
          phone: phone || null,
          address: address || null,
          timezone: timezone || 'UTC',
          invited_by: session.user.id,
          invitation_sent_at: new Date().toISOString()
        },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?type=invite`
      });

      if (inviteError) {
        console.error('Error sending invitation:', inviteError);
        return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Invitation sent successfully',
        user: {
          id: inviteData.user?.id,
          email: inviteData.user?.email,
          invited_at: inviteData.user?.invited_at,
          invitation_sent_at: new Date().toISOString()
        }
      }, { status: 201 });

    } else {
      // Create user directly (for manual account creation - development only)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        user_metadata: {
          full_name,
          role,
          company_name: company_name || null,
          phone: phone || null,
          address: address || null,
          timezone: timezone || 'UTC',
          created_by: session.user.id
        },
        email_confirm: true // Auto-confirm email for dev
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: newUser.user.id,
          email,
          full_name,
          role,
          company_name: company_name || null,
          phone: phone || null,
          address: address || null,
          timezone: timezone || 'UTC'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Try to cleanup the auth user if profile creation failed
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
      }

      return NextResponse.json({
        message: 'User created successfully',
        user: profile
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Unexpected error in POST /api/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}