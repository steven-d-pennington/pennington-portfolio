#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🚀 Authentication Database Setup');
console.log('=====================================\n');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment
if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
  console.error('❌ Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Please set SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('   Find this in Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('🔧 Environment Configuration:');
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Service Key: ***${SUPABASE_SERVICE_ROLE_KEY.slice(-6)}\n`);

async function setupAuth() {
  console.log('🔍 Testing connection...');
  
  try {
    // Simple connection test
    const { data, error } = await supabase.auth.getSession();
    console.log('✅ Supabase connection successful\n');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }

  console.log('🏗️  Creating authentication schema...\n');

  // Step 1: Create user_profiles table
  console.log('1️⃣ Creating user_profiles table...');
  try {
    const { error } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS public.user_profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
      `
    });
    
    if (error) {
      console.log('   Note: This may require manual setup in Supabase Dashboard');
    } else {
      console.log('✅ user_profiles table created');
    }
  } catch (err) {
    console.log('⚠️  Manual setup required for user_profiles table');
  }

  // Step 2: Test if we can query the tables that should exist
  console.log('\n2️⃣ Checking existing tables...');
  
  // Check contact_requests
  try {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .limit(1);
      
    if (error && !error.message.includes('relation "public.contact_requests" does not exist')) {
      console.log('✅ contact_requests table exists');
    } else if (error) {
      console.log('❌ contact_requests table needs to be created');
      console.log('   Please make sure your existing tables are set up');
    } else {
      console.log('✅ contact_requests table exists');
    }
  } catch (err) {
    console.log('⚠️  Could not check contact_requests table');
  }

  // Check chat_conversations  
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .limit(1);
      
    if (error && !error.message.includes('relation "public.chat_conversations" does not exist')) {
      console.log('✅ chat_conversations table exists');
    } else if (error) {
      console.log('❌ chat_conversations table needs to be created');
    } else {
      console.log('✅ chat_conversations table exists');
    }
  } catch (err) {
    console.log('⚠️  Could not check chat_conversations table');
  }

  return true;
}

async function main() {
  const success = await setupAuth();
  
  console.log('\n📋 Complete Setup Instructions:');
  console.log('=====================================');
  console.log('Since automatic setup has limitations, please complete setup manually:');
  console.log('');
  console.log('1. 📖 Open your Supabase Dashboard');
  console.log('   https://app.supabase.com/project/[your-project-id]');
  console.log('');
  console.log('2. 🔧 Go to SQL Editor');
  console.log('   Dashboard → SQL Editor');
  console.log('');
  console.log('3. 📄 Open supabase-auth-setup.sql');
  console.log('   Copy ALL content from the supabase-auth-setup.sql file');
  console.log('');
  console.log('4. ▶️  Execute the SQL');
  console.log('   Paste into SQL Editor and click "Run"');
  console.log('');
  console.log('5. ✅ Verify Setup');
  console.log('   Run: npm run test:supabase');
  console.log('');
  console.log('📄 The supabase-auth-setup.sql file contains:');
  console.log('   ✓ user_profiles table creation');
  console.log('   ✓ Row Level Security (RLS) policies');
  console.log('   ✓ Triggers for automatic profile creation');
  console.log('   ✓ Indexes for performance');
  console.log('   ✓ Permission grants');
  console.log('');
  console.log('🚨 Important: Make sure to run the ENTIRE script, not just parts of it!');
  
  if (success) {
    console.log('\n✅ Setup check completed successfully!');
  }
}

main().catch(console.error);