#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🚀 Database Setup Script');
console.log('=====================================\n');

// Validate environment variables
if (!SUPABASE_URL || SUPABASE_URL === 'https://placeholder-url.supabase.co') {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set or is placeholder');
  console.log('Please set your actual Supabase URL in .env.local');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set');
  console.log('Please set your Supabase service role key in .env.local');
  console.log('You can find this in your Supabase dashboard under Settings > API');
  process.exit(1);
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'placeholder-key') {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set or is placeholder');
  console.log('Please set your actual Supabase anon key in .env.local');
  process.exit(1);
}

console.log('🔧 Environment Check:');
console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`Service Role Key: ${'*'.repeat(20)}${SUPABASE_SERVICE_ROLE_KEY.slice(-8)}`);
console.log(`Anon Key: ${'*'.repeat(20)}${SUPABASE_ANON_KEY.slice(-8)}\n`);

// Create Supabase client with service role for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// SQL commands to execute
const sqlCommands = [
  {
    name: 'Create user_profiles table',
    sql: `
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE,
        full_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  },
  {
    name: 'Create indexes on user_profiles',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
    `
  },
  {
    name: 'Enable RLS on user_profiles',
    sql: `ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;`
  },
  {
    name: 'Create RLS policies for user_profiles',
    sql: `
      -- Drop existing policies
      DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
      DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_profiles;
      DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
      
      -- Create new policies
      CREATE POLICY "Users can view own profile" 
        ON public.user_profiles 
        FOR SELECT 
        USING (auth.uid() = id);
      
      CREATE POLICY "Users can update own profile" 
        ON public.user_profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
      
      CREATE POLICY "Enable insert for service role" 
        ON public.user_profiles 
        FOR INSERT 
        WITH CHECK (true);
      
      CREATE POLICY "Admins can view all profiles" 
        ON public.user_profiles 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    `
  },
  {
    name: 'Create updated_at trigger function',
    sql: `
      CREATE OR REPLACE FUNCTION public.handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `
  },
  {
    name: 'Create updated_at trigger',
    sql: `
      DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.user_profiles
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    `
  },
  {
    name: 'Add user_id to contact_requests',
    sql: `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'contact_requests' 
          AND column_name = 'user_id'
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE public.contact_requests 
          ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
          
          CREATE INDEX IF NOT EXISTS idx_contact_requests_user_id ON public.contact_requests(user_id);
        END IF;
      END $$;
    `
  },
  {
    name: 'Add user_id to chat_conversations',
    sql: `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'chat_conversations' 
          AND column_name = 'user_id'
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE public.chat_conversations 
          ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
          
          CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
        END IF;
      END $$;
    `
  },
  {
    name: 'Setup RLS for contact_requests',
    sql: `
      ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view own contact requests" ON public.contact_requests;
      DROP POLICY IF EXISTS "Anyone can insert contact requests" ON public.contact_requests;

      CREATE POLICY "Users can view own contact requests" 
        ON public.contact_requests 
        FOR SELECT 
        USING (
          auth.uid() = user_id OR 
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
          )
        );

      CREATE POLICY "Anyone can insert contact requests" 
        ON public.contact_requests 
        FOR INSERT 
        WITH CHECK (true);
    `
  },
  {
    name: 'Setup RLS for chat_conversations',
    sql: `
      ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view own chat conversations" ON public.chat_conversations;
      DROP POLICY IF EXISTS "Authenticated users can insert chat conversations" ON public.chat_conversations;

      CREATE POLICY "Users can view own chat conversations" 
        ON public.chat_conversations 
        FOR SELECT 
        USING (
          auth.uid() = user_id OR 
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
          )
        );

      CREATE POLICY "Authenticated users can insert chat conversations" 
        ON public.chat_conversations 
        FOR INSERT 
        WITH CHECK (auth.uid() IS NOT NULL);
    `
  },
  {
    name: 'Create new user profile trigger function',
    sql: `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
          COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  },
  {
    name: 'Create new user trigger',
    sql: `
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `
  },
  {
    name: 'Grant permissions',
    sql: `
      GRANT USAGE ON SCHEMA public TO anon, authenticated;
      GRANT ALL ON public.user_profiles TO anon, authenticated;
      GRANT ALL ON public.contact_requests TO anon, authenticated;
      GRANT ALL ON public.chat_conversations TO anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
    `
  }
];

async function setupDatabase() {
  console.log('🔍 Testing connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('auth.users').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is ok
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Connection successful!\n');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }

  console.log('🏗️  Setting up database schema...\n');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const command of sqlCommands) {
    console.log(`⚙️  ${command.name}...`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: command.sql });
      
      if (error) {
        // Try alternative approach for commands that might not work with rpc
        const { error: directError } = await supabase
          .from('_supabase_internal')
          .select('*')
          .limit(0); // This won't work, but we'll catch the error and try direct execution
          
        console.log(`⚠️  Note: ${command.name} may need manual execution`);
        console.log(`   SQL: ${command.sql.trim()}`);
        failureCount++;
      } else {
        console.log(`✅ ${command.name} completed`);
        successCount++;
      }
    } catch (err) {
      console.log(`⚠️  ${command.name} needs manual setup`);
      console.log(`   Reason: ${err.message}`);
      failureCount++;
    }
  }
  
  console.log(`\n📊 Setup Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⚠️  Manual setup needed: ${failureCount}`);
  
  if (failureCount > 0) {
    console.log(`\n📝 Manual Setup Required:`);
    console.log(`Some commands couldn't be executed automatically.`);
    console.log(`Please run the SQL commands from 'supabase-auth-setup.sql' manually in your Supabase dashboard.`);
    console.log(`Go to: Dashboard → SQL Editor → Paste the SQL → Run`);
  }
  
  return failureCount === 0;
}

async function verifySetup() {
  console.log(`\n🔍 Verifying setup...`);
  
  try {
    // Check if user_profiles table exists
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_profiles');
      
    if (error) {
      console.log('⚠️  Could not verify table creation automatically');
      return false;
    }
    
    if (tables && tables.length > 0) {
      console.log('✅ user_profiles table exists');
      return true;
    } else {
      console.log('❌ user_profiles table not found');
      return false;
    }
  } catch (err) {
    console.log('⚠️  Verification error:', err.message);
    return false;
  }
}

async function testAuthFlow() {
  console.log(`\n🧪 Testing authentication flow...`);
  
  try {
    // Test that we can query user_profiles (should return empty result but no error)
    const { error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Authentication tables not properly configured');
      console.log(`   Error: ${error.message}`);
      return false;
    } else {
      console.log('✅ Authentication tables configured correctly');
      return true;
    }
  } catch (err) {
    console.log('❌ Authentication test failed:', err.message);
    return false;
  }
}

// Main execution
async function main() {
  const setupSuccess = await setupDatabase();
  
  if (setupSuccess) {
    const verifySuccess = await verifySetup();
    if (verifySuccess) {
      const authSuccess = await testAuthFlow();
      if (authSuccess) {
        console.log(`\n🎉 Database setup complete!`);
        console.log(`Your authentication system is ready to use.`);
        console.log(`\nNext steps:`);
        console.log(`1. Start your dev server: npm run dev`);
        console.log(`2. Go to http://localhost:3000`);
        console.log(`3. Click "Sign Up" to create your first account`);
        console.log(`4. Test the authentication flow`);
      }
    }
  }
  
  console.log(`\n📋 Manual Setup Instructions:`);
  console.log(`If automatic setup had issues, please:`);
  console.log(`1. Open your Supabase Dashboard`);
  console.log(`2. Go to SQL Editor`);
  console.log(`3. Copy and paste the content from 'supabase-auth-setup.sql'`);
  console.log(`4. Execute the script`);
  console.log(`5. Run this script again to verify: node setup-database.js`);
}

main().catch(console.error);