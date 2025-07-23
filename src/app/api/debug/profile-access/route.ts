import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return NextResponse.json({
        error: 'Session error',
        details: sessionError
      }, { status: 401 });
    }

    if (!session) {
      return NextResponse.json({
        error: 'No active session'
      }, { status: 401 });
    }

    // Try to fetch the user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      sessionUserId: session.user.id,
      sessionUserEmail: session.user.email,
      profile: profile,
      profileError: profileError,
      success: !profileError
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Unexpected error',
      details: error
    }, { status: 500 });
  }
}