import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';

export async function GET(request: NextRequest) {
  try {
    // Check if steven@spennington.dev profile exists
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', 'steven@spennington.dev')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message 
      }, { status: 500 });
    }

    // Also check all profiles to see what we have
    const { data: allProfiles, error: allError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, role, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({ 
      stevenProfile: profile,
      allProfiles: allProfiles || [],
      hasProfiles: (allProfiles?.length || 0) > 0
    });

  } catch (error: any) {
    console.error('Error checking profiles:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}