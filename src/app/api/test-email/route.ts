import { NextRequest, NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    const debugInfo = {
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5),
      fromEmail: process.env.RESEND_FROM_EMAIL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    };

    console.log('Debug info:', debugInfo);

    // Send test invitation to your email
    const result = await sendInvitationEmail({
      to: 'steve.d.pennington@gmail.com',
      inviterName: 'System Admin',
      inviteeName: 'Steve Pennington',
      role: 'admin',
      companyName: 'Monkey LoveStack',
      acceptUrl: 'http://localhost:3000/accept-invitation/test-token-123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    if (result.success) {
      return NextResponse.json({
        message: 'Test invitation email sent successfully to steve.d.pennington@gmail.com',
        data: result.data,
        debug: debugInfo
      });
    } else {
      return NextResponse.json({
        message: 'Failed to send test email',
        error: result.data,
        debug: debugInfo
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      message: 'Failed to test email service',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}