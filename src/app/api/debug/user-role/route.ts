import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/server-database'

export async function GET(request: NextRequest) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Extract user ID from URL params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 })
    }

    // Get user profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'User profile not found', details: error.message }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['user', 'admin', 'moderator', 'client', 'team_member']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }, { status: 400 })
    }

    // Update user profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update role', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data, message: 'Role updated successfully' })
  } catch (error: any) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}