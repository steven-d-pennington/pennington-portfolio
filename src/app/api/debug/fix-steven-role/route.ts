import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server-database';

export async function POST(request: NextRequest) {
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', 'steven@spennington.dev')
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ 
        error: 'Database error checking profile', 
        details: checkError.message 
      }, { status: 500 });
    }

    if (!existingProfile) {
      // Get auth user by email to create profile
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (authError) {
        return NextResponse.json({ 
          error: 'Error listing auth users', 
          details: authError.message 
        }, { status: 500 });
      }

      const stevenUser = authUsers.users.find(u => u.email === 'steven@spennington.dev');
      
      if (!stevenUser) {
        return NextResponse.json({ 
          error: 'Steven auth user not found',
          availableUsers: authUsers.users.map(u => u.email)
        }, { status: 404 });
      }

      // Create profile
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert([
          {
            id: stevenUser.id,
            email: stevenUser.email!,
            full_name: stevenUser.user_metadata?.full_name || 'Steven Pennington',
            avatar_url: stevenUser.user_metadata?.avatar_url || null,
            role: 'admin', // Make Steven admin
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ 
          error: 'Error creating profile', 
          details: createError.message 
        }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'Profile created successfully',
        profile: newProfile
      });
    } else {
      // Update existing profile to admin
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({ 
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('email', 'steven@spennington.dev')
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ 
          error: 'Error updating profile', 
          details: updateError.message 
        }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'Profile updated to admin successfully',
        profile: updatedProfile
      });
    }

  } catch (error: any) {
    console.error('Error fixing Steven role:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}