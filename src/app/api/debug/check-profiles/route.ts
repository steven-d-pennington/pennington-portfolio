import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function GET() {
  try {
    // Check admin user
    const { data: adminProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', 'steven@spennington.dev')
      .single()

    // Check team user
    const { data: teamProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', 'stevepenn@hotmail.com')
      .single()

    // Check all profiles for these user IDs
    const { data: allProfiles } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .in('id', ['f0b91f28-6b28-467a-bd1b-f9e1058a0d55', 'ee60f3d0-fc60-41bd-bbdb-d4e920f16922'])

    return NextResponse.json({
      adminProfile,
      teamProfile,
      allProfiles,
      adminUserId: 'f0b91f28-6b28-467a-bd1b-f9e1058a0d55',
      teamUserId: 'ee60f3d0-fc60-41bd-bbdb-d4e920f16922'
    })

  } catch (error) {
    console.error('Error checking profiles:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}