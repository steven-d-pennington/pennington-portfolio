import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';
import { sendInvitationEmail } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    // Note: This endpoint should only be accessible to admins
    // Access control is handled by the UI and RLS policies

    // Get search params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch invitations with inviter info
    let query = supabaseAdmin
      .from('user_invitations')
      .select(`
        *,
        inviter:user_profiles!user_invitations_invited_by_fkey(
          id,
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: invitations, error } = await query;

    if (error) {
      console.error('Error fetching invitations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }

    // Get stats
    const { data: stats } = await supabaseAdmin
      .from('user_invitations')
      .select('status')
      .then(({ data }) => {
        const counts = data?.reduce((acc, inv) => {
          acc[inv.status] = (acc[inv.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        return {
          data: {
            total: data?.length || 0,
            pending: counts.pending || 0,
            accepted: counts.accepted || 0,
            expired: counts.expired || 0,
            cancelled: counts.cancelled || 0,
          }
        };
      });

    return NextResponse.json({
      invitations,
      stats: stats || {
        total: 0,
        pending: 0,
        accepted: 0,
        expired: 0,
        cancelled: 0,
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Note: This endpoint should only be accessible to admins
    // For now, we'll use a hardcoded admin user ID
    // TODO: Add proper session-based authentication
    
    const adminUserId = 'your-admin-user-id'; // Replace with actual admin user ID
    
    // Get admin user profile
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id, role, full_name')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'No admin user found' }, { status: 403 });
    }

    const body = await request.json();
    const { email, full_name, role, company_name, phone, address, timezone } = body;

    // Validate required fields
    if (!email || !full_name || !role) {
      return NextResponse.json(
        { error: 'Email, full name, and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['user', 'admin', 'client', 'team_member', 'moderator'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
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

    // Check if pending invitation already exists
    const { data: existingInvitation } = await supabaseAdmin
      .from('user_invitations')
      .select('id')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Pending invitation already exists for this email' },
        { status: 409 }
      );
    }

    // Create invitation
    const { data: invitation, error: insertError } = await supabaseAdmin
      .from('user_invitations')
      .insert({
        email,
        full_name,
        role,
        company_name: company_name || null,
        phone: phone || null,
        address: address || null,
        timezone: timezone || 'UTC',
        invited_by: userProfile.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Send invitation email
    try {
      console.log('Preparing to send invitation email...');
      const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${invitation.invitation_token}`;
      
      console.log('Email parameters:', {
        to: email,
        inviterName: userProfile.full_name || 'Admin',
        inviteeName: full_name,
        role,
        companyName: company_name || 'Monkey LoveStack',
        acceptUrl,
        expiresAt: new Date(invitation.expires_at),
      });
      
      await sendInvitationEmail({
        to: email,
        inviterName: userProfile.full_name || 'Admin',
        inviteeName: full_name,
        role,
        companyName: company_name || 'Monkey LoveStack',
        acceptUrl,
        expiresAt: new Date(invitation.expires_at),
      });

      console.log(`Invitation email sent successfully to ${email}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      console.error('Email error details:', {
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });
      
      // Delete the invitation if email failed
      await supabaseAdmin
        .from('user_invitations')
        .delete()
        .eq('id', invitation.id);

      return NextResponse.json(
        { 
          error: 'Failed to send invitation email',
          details: emailError instanceof Error ? emailError.message : 'Unknown email error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Invitation sent successfully',
      invitation 
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}