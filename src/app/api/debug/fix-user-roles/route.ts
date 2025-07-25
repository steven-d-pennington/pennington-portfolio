import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/server-database'

export async function POST() {
  try {
    console.log('🔧 Fixing user roles and ensuring test users exist...')

    // 1. Check and create admin user steven@spennington.dev if needed
    console.log('1. Checking admin user: steven@spennington.dev')
    const { data: adminAuthUser } = await supabaseAdmin.auth.admin.listUsers()
    const adminExists = adminAuthUser.users.find(u => u.email === 'steven@spennington.dev')
    
    let adminResult = { action: '', status: '' }
    
    if (!adminExists) {
      console.log('   Creating admin user...')
      const { data: newAdmin, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: 'steven@spennington.dev',
        password: 'StarDust',
        email_confirm: true,
        user_metadata: {
          full_name: 'Steven Pennington',
          role: 'admin'
        }
      })
      
      if (createError) {
        adminResult = { action: 'create_admin', status: 'failed: ' + createError.message }
      } else {
        // Create user profile
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: newAdmin.user.id,
            email: 'steven@spennington.dev',
            full_name: 'Steven Pennington',
            role: 'admin',
            status: 'active'
          })
          
        if (profileError) {
          adminResult = { action: 'create_admin', status: 'user created but profile failed: ' + profileError.message }
        } else {
          adminResult = { action: 'create_admin', status: 'success' }
        }
      }
    } else {
      // Update role to admin if needed
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', adminExists.id)
        .single()
        
      if (profile?.role !== 'admin') {
        const { error } = await supabaseAdmin
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('id', adminExists.id)
          
        if (error) {
          adminResult = { action: 'update_admin_role', status: 'failed: ' + error.message }
        } else {
          adminResult = { action: 'update_admin_role', status: 'success' }
        }
      } else {
        adminResult = { action: 'admin_exists', status: 'already correct' }
      }
    }

    // 2. Fix stevepenn@hotmail.com role (user -> team_member)
    console.log('2. Fixing stevepenn@hotmail.com role')
    const { data: teamUser } = await supabaseAdmin
      .from('user_profiles')
      .select('id, role')
      .eq('email', 'stevepenn@hotmail.com')
      .single()
      
    let teamResult = { action: '', status: '' }
    
    if (teamUser) {
      if (teamUser.role === 'user') {
        const { error } = await supabaseAdmin
          .from('user_profiles')
          .update({ role: 'team_member' })
          .eq('id', teamUser.id)
          
        if (error) {
          teamResult = { action: 'update_team_role', status: 'failed: ' + error.message }
        } else {
          teamResult = { action: 'update_team_role', status: 'success: user → team_member' }
        }
      } else {
        teamResult = { action: 'team_role_check', status: 'already correct: ' + teamUser.role }
      }
    } else {
      teamResult = { action: 'find_team_user', status: 'not found in user_profiles' }
    }

    // 3. Verify client user exists and is properly configured
    console.log('3. Verifying client@monkeylovestack.com')
    const { data: clientContact } = await supabaseAdmin
      .from('client_contacts')
      .select(`
        id, email, role, client_company_id,
        client_companies:client_company_id (company_name)
      `)
      .eq('email', 'client@monkeylovestack.com')
      .single()
      
    let clientResult = { action: '', status: '', details: {} }
    
    if (clientContact) {
      clientResult = {
        action: 'verify_client',
        status: 'exists',
        details: {
          email: clientContact.email,
          role: clientContact.role,
          company: (clientContact.client_companies as any)?.company_name || 'Unknown'
        }
      }
    } else {
      clientResult = { action: 'verify_client', status: 'not found', details: {} }
    }

    return NextResponse.json({
      success: true,
      results: {
        admin: adminResult,
        team: teamResult,
        client: clientResult
      },
      testUsers: {
        admin: {
          email: 'steven@spennington.dev',
          password: 'StarDust',
          role: 'admin',
          access: 'Full dashboard access'
        },
        team: {
          email: 'stevepenn@hotmail.com',
          password: 'StarDust',
          role: 'team_member',
          access: 'Limited dashboard access'
        },
        client: {
          email: 'client@monkeylovestack.com',
          password: 'StarDust',
          role: 'owner',
          access: 'Client dashboard only'
        }
      }
    })

  } catch (error) {
    console.error('Error fixing user roles:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}