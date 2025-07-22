import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/server-database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('=== AUTH DEBUG ===')
    console.log('Auth header:', authHeader ? 'Present' : 'Missing')
    console.log('User ID from params:', userId)

    if (!authHeader) {
      return NextResponse.json({ 
        error: 'No authorization header',
        details: 'Authorization header is required' 
      }, { status: 401 })
    }

    if (!userId) {
      return NextResponse.json({ 
        error: 'No userId provided',
        details: 'userId query parameter is required' 
      }, { status: 400 })
    }

    // Try to get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.log('Profile error:', profileError)
      return NextResponse.json({
        error: 'Profile fetch failed',
        details: profileError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Authentication test successful'
    })

  } catch (error: any) {
    console.error('Test auth error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    )
  }
}