import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    // Validate invitation token
    const { data: invitation, error } = await supabaseAdmin
      .from('user_invitations')
      .select(`
        *,
        inviter:user_profiles!user_invitations_invited_by_fkey(
          full_name,
          company_name
        )
      `)
      .eq('invitation_token', token)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { 
          error: 'This invitation is no longer valid',
          status: invitation.status 
        },
        { status: 400 }
      );
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Update status to expired
      await supabaseAdmin
        .from('user_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', invitation.email)
      .single();

    if (existingUser) {
      // Mark invitation as accepted if user exists
      await supabaseAdmin
        .from('user_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      return NextResponse.json(
        { 
          error: 'A user with this email already exists. Please sign in instead.',
          userExists: true 
        },
        { status: 409 }
      );
    }

    // Return invitation details for the form
    return NextResponse.json({
      invitation: {
        email: invitation.email,
        full_name: invitation.full_name,
        role: invitation.role,
        company_name: invitation.company_name,
        inviter_name: invitation.inviter?.full_name,
        inviter_company: invitation.inviter?.company_name,
        expires_at: invitation.expires_at,
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/invitations/accept/[token]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const body = await request.json();
    const { password, confirmPassword } = body;

    // Validate password
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Get invitation
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('user_invitations')
      .select('*')
      .eq('invitation_token', token)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    // Validate invitation
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'This invitation is no longer valid' },
        { status: 400 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', invitation.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Create auth user via Supabase Admin API
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password: password,
      email_confirm: true, // Auto-confirm email since it's invited
    });

    if (authError || !authUser.user) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authUser.user.id,
        email: invitation.email,
        full_name: invitation.full_name,
        role: invitation.role,
        company_name: invitation.company_name,
        phone: invitation.phone,
        address: invitation.address,
        timezone: invitation.timezone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Mark invitation as accepted
    await supabaseAdmin
      .from('user_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    // Generate a session for the new user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: invitation.email,
    });

    if (sessionError) {
      console.error('Error generating session:', sessionError);
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: authUser.user.id,
        email: invitation.email,
        full_name: invitation.full_name,
        role: invitation.role,
      },
      // Include magic link for automatic sign-in if available
      signInUrl: sessionData?.properties?.action_link || null,
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/invitations/accept/[token]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}