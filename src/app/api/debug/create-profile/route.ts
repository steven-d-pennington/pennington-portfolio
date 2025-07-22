import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, fullName, role = 'admin' } = body

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 })
    }

    console.log('Creating profile for:', { userId, email, fullName, role })

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (existingProfile) {
      return NextResponse.json({ 
        profile: existingProfile, 
        message: 'Profile already exists',
        action: 'found_existing'
      })
    }

    // Create the user profile
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName || null,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating profile:', createError)
      return NextResponse.json({ 
        error: 'Failed to create profile', 
        details: createError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      profile: newProfile, 
      message: 'Profile created successfully!',
      action: 'created_new'
    })

  } catch (error: any) {
    console.error('Error in create-profile:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 })
  }
}