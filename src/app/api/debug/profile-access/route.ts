import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { supabaseAdmin } from '@/lib/server-database';

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

    // Try to fetch the user profile with client (RLS-affected)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Also try with admin client (bypasses RLS)
    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      sessionUserId: session.user.id,
      sessionUserEmail: session.user.email,
      authUserId: session.user.id,
      
      // Client results (with RLS)
      clientProfile: profile,
      clientError: profileError,
      clientSuccess: !profileError,
      
      // Admin results (bypasses RLS)
      adminProfile: adminProfile,
      adminError: adminError,
      adminSuccess: !adminError,
      
      // Analysis
      rlsBlocking: !profileError && adminError ? false : (!profile && adminProfile ? true : false)
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Unexpected error',
      details: error
    }, { status: 500 });
  }
}