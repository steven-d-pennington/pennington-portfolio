import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';
import { sendInvitationEmail } from '@/lib/email-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Note: This endpoint should only be accessible to admins
    // Access control is handled by the UI and RLS policies

    const invitationId = params.id;

    const { data: invitation, error } = await supabaseAdmin
      .from('user_invitations')
      .select(`
        *,
        inviter:user_profiles!user_invitations_invited_by_fkey(
          id,
          full_name,
          email
        )
      `)
      .eq('id', invitationId)
      .single();

    if (error) {
      console.error('Error fetching invitation:', error);
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ invitation });

  } catch (error) {
    console.error('Unexpected error in GET /api/invitations/[id]:', error);
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
    // Get admin user profile for email sending
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id, role, full_name')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'No admin user found' }, { status: 403 });
    }

    const invitationId = params.id;
    const body = await request.json();
    const { action } = body; // 'resend', 'cancel', 'extend'

    // Get current invitation
    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from('user_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'resend':
        if (invitation.status !== 'pending') {
          return NextResponse.json(
            { error: 'Can only resend pending invitations' },
            { status: 400 }
          );
        }

        // Extend expiration and send new email
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        const { error: updateError } = await supabaseAdmin
          .from('user_invitations')
          .update({ 
            expires_at: newExpiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', invitationId);

        if (updateError) {
          console.error('Error updating invitation:', updateError);
          return NextResponse.json(
            { error: 'Failed to update invitation' },
            { status: 500 }
          );
        }

        // Resend email
        try {
          const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${invitation.invitation_token}`;
          
          await sendInvitationEmail({
            to: invitation.email,
            inviterName: userProfile.full_name || 'Admin',
            inviteeName: invitation.full_name,
            role: invitation.role,
            companyName: invitation.company_name || 'Monkey LoveStack',
            acceptUrl,
            expiresAt: newExpiresAt,
          });
        } catch (emailError) {
          console.error('Failed to resend invitation email:', emailError);
          return NextResponse.json(
            { error: 'Failed to resend invitation email' },
            { status: 500 }
          );
        }

        return NextResponse.json({ 
          message: 'Invitation resent successfully',
          invitation: { ...invitation, expires_at: newExpiresAt.toISOString() }
        });

      case 'cancel':
        if (invitation.status !== 'pending') {
          return NextResponse.json(
            { error: 'Can only cancel pending invitations' },
            { status: 400 }
          );
        }

        const { error: cancelError } = await supabaseAdmin
          .from('user_invitations')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', invitationId);

        if (cancelError) {
          console.error('Error cancelling invitation:', cancelError);
          return NextResponse.json(
            { error: 'Failed to cancel invitation' },
            { status: 500 }
          );
        }

        return NextResponse.json({ 
          message: 'Invitation cancelled successfully'
        });

      case 'extend':
        if (invitation.status !== 'pending') {
          return NextResponse.json(
            { error: 'Can only extend pending invitations' },
            { status: 400 }
          );
        }

        const extendedExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        const { error: extendError } = await supabaseAdmin
          .from('user_invitations')
          .update({ 
            expires_at: extendedExpiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', invitationId);

        if (extendError) {
          console.error('Error extending invitation:', extendError);
          return NextResponse.json(
            { error: 'Failed to extend invitation' },
            { status: 500 }
          );
        }

        return NextResponse.json({ 
          message: 'Invitation extended successfully',
          invitation: { ...invitation, expires_at: extendedExpiresAt.toISOString() }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: resend, cancel, or extend' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Unexpected error in PATCH /api/invitations/[id]:', error);
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
    // Note: This endpoint should only be accessible to admins
    // Access control is handled by the UI and RLS policies

    const invitationId = params.id;

    const { error } = await supabaseAdmin
      .from('user_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) {
      console.error('Error deleting invitation:', error);
      return NextResponse.json(
        { error: 'Failed to delete invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Invitation deleted successfully' 
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/invitations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}