#!/usr/bin/env tsx

import { config } from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAuthUsers() {
  console.log('🔍 Checking existing auth users...')
  
  // Check auth.users table
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('❌ Error fetching auth users:', authError)
    return
  }
  
  console.log(`\n📊 Found ${authUsers.users.length} auth users:`)
  authUsers.users.forEach(user => {
    console.log(`   • ${user.email} (${user.id})`)
  })
  
  // Check user_profiles table
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
  
  if (profileError) {
    console.error('❌ Error fetching user profiles:', profileError)
    return
  }
  
  console.log(`\n👥 Found ${profiles.length} user profiles:`)
  profiles.forEach(profile => {
    console.log(`   • ${profile.full_name} (${profile.email}) - ${profile.role}`)
  })
  
  return { authUsers: authUsers.users, profiles }
}

checkAuthUsers()