import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { supabaseAdmin } from '@/lib/server-database';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Use admin client to bypass RLS issues temporarily
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile via API:', profileError);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Unexpected error in profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}