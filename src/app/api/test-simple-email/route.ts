import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    console.log('Testing simple email...');
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@resend.dev',
      to: 'steve.d.pennington@gmail.com',
      subject: 'Simple Test Email',
      html: '<h1>Hello World!</h1><p>This is a simple test email from Resend.</p>',
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({
        message: 'Failed to send simple email',
        error
      }, { status: 500 });
    }

    console.log('Simple email sent:', data);
    return NextResponse.json({
      message: 'Simple email sent successfully',
      data
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}