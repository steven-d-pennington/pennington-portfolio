import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function POST() {
  try {
    console.log('🔧 Fixing missing user profiles and passwords...')

    // 1. Get admin user from auth and create profile if missing
    const { data: adminAuthUser } = await supabaseAdmin.auth.admin.listUsers()
    const adminUser = adminAuthUser.users.find(u => u.email === 'steven@spennington.dev')
    
    let adminResult = { action: '', status: '' }
    
    if (adminUser) {
      // Check if profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', adminUser.id)
        .single()
        
      if (!existingProfile) {
        console.log('Creating missing admin profile...')
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: adminUser.id,
            email: 'steven@spennington.dev',
            full_name: 'Steven Pennington',
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
        if (profileError) {
          adminResult = { action: 'create_admin_profile', status: 'failed: ' + profileError.message }
        } else {
          adminResult = { action: 'create_admin_profile', status: 'success' }
        }
      } else {
        adminResult = { action: 'admin_profile_check', status: 'already exists' }
      }
    } else {
      adminResult = { action: 'find_admin_user', status: 'not found in auth' }
    }

    // 2. Check stevepenn@hotmail.com profile
    const stevePennUser = adminAuthUser.users.find(u => u.email === 'stevepenn@hotmail.com')
    let stevePennResult = { action: '', status: '' }
    
    if (stevePennUser) {
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', stevePennUser.id)
        .single()
        
      if (existingProfile) {
        stevePennResult = { action: 'stevepenn_profile_check', status: 'exists with role: ' + existingProfile.role }
      } else {
        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: stevePennUser.id,
            email: 'stevepenn@hotmail.com',
            full_name: 'Steven Penn',
            role: 'team_member',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
        if (profileError) {
          stevePennResult = { action: 'create_stevepenn_profile', status: 'failed: ' + profileError.message }
        } else {
          stevePennResult = { action: 'create_stevepenn_profile', status: 'success' }
        }
      }
    } else {
      stevePennResult = { action: 'find_stevepenn_user', status: 'not found in auth' }
    }

    // 3. Fix client password
    const clientUser = adminAuthUser.users.find(u => u.email === 'client@monkeylovestack.com')
    let clientResult = { action: '', status: '' }
    
    if (clientUser) {
      console.log('Updating client password...')
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
        clientUser.id,
        { password: 'StarDust' }
      )
      
      if (passwordError) {
        clientResult = { action: 'update_client_password', status: 'failed: ' + passwordError.message }
      } else {
        clientResult = { action: 'update_client_password', status: 'success' }
      }
    } else {
      clientResult = { action: 'find_client_user', status: 'not found in auth' }
    }

    return NextResponse.json({
      success: true,
      results: {
        admin: adminResult,
        stevePenn: stevePennResult,
        client: clientResult
      },
      message: 'Profile fixes complete'
    })

  } catch (error) {
    console.error('Error fixing profiles:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}