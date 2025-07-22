import { Resend } from 'resend';
import InvitationEmail from '@/components/emails/InvitationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendInvitationEmailParams {
  to: string;
  inviterName: string;
  inviteeName: string;
  role: string;
  companyName?: string;
  acceptUrl: string;
  expiresAt: Date;
}

export async function sendInvitationEmail({
  to,
  inviterName,
  inviteeName,
  role,
  companyName = 'Monkey LoveStack',
  acceptUrl,
  expiresAt,
}: SendInvitationEmailParams) {
  try {
    console.log('Starting email send process...');
    console.log('Environment check:', {
      hasApiKey: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
      to,
    });

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    console.log('Sending email via Resend with React component...');
    
    // Create the React element properly
    const emailComponent = InvitationEmail({
      inviterName,
      inviteeName,
      role,
      companyName,
      acceptUrl,
      expiresAt,
    });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
      to,
      subject: `You're invited to join ${companyName}`,
      react: emailComponent,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    throw error;
  }
}

export async function testEmailConnection() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
      to: 'test@example.com',
      subject: 'Test Email Connection',
      html: '<p>This is a test email to verify Resend configuration.</p>',
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}