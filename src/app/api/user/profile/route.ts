import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/server-database';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Create server client that can read cookies
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    // Get the current session to verify authentication
    const { data: { session }, error: sessionError } = await supabaseServer.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // First check if this is a client contact
    const { data: clientContact, error: clientError } = await supabaseAdmin
      .from('client_contacts')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (clientContact) {
      // This is a client contact, return a profile indicating they should use client portal
      return NextResponse.json({ 
        profile: {
          id: clientContact.id,
          email: clientContact.email,
          full_name: clientContact.full_name,
          role: 'client_contact', // Special role to indicate client contact
          created_at: clientContact.created_at,
          updated_at: clientContact.updated_at,
          is_client_contact: true
        }
      });
    }

    // Not a client contact, check user_profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Unexpected error in user profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}