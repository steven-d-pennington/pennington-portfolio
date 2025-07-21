import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/utils/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    // Handle authentication errors
    console.error('Auth callback error:', error, errorDescription);
    
    let userMessage = 'Authentication failed. Please try again.';
    let redirectPath = '/';
    
    switch (error) {
      case 'access_denied':
        if (errorDescription?.includes('otp_expired') || errorDescription?.includes('expired')) {
          userMessage = 'The email confirmation link has expired. Please request a new one.';
        } else {
          userMessage = 'Email confirmation was denied or cancelled.';
        }
        redirectPath = '/?auth_error=expired_link';
        break;
      case 'server_error':
        userMessage = 'Server error occurred during authentication.';
        redirectPath = '/?auth_error=server_error';
        break;
      default:
        redirectPath = `/?auth_error=${error}`;
    }
    
    return NextResponse.redirect(`${origin}${redirectPath}&message=${encodeURIComponent(userMessage)}`);
  }

  if (code) {
    const supabase = await createSupabaseServer();
    
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(`${origin}/?auth_error=exchange_failed&message=${encodeURIComponent('Failed to confirm email. Please try signing up again.')}`);
      }
      
      // Success! Redirect to dashboard or intended page
      return NextResponse.redirect(`${origin}${next}?auth_success=email_confirmed`);
      
    } catch (err) {
      console.error('Auth callback error:', err);
      return NextResponse.redirect(`${origin}/?auth_error=callback_error&message=${encodeURIComponent('An error occurred during email confirmation.')}`);
    }
  }

  // No code or error - redirect to home
  return NextResponse.redirect(`${origin}/`);
}