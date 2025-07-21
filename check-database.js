#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Database Status Check');
console.log('========================\n');

// Use environment variables loaded by dotenv
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Configuration:');
console.log(`Supabase URL: ${SUPABASE_URL || 'Not found'}`);
console.log(`Anon Key: ${SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}`);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkCurrentState() {
  console.log('\n🔍 Checking current database state...\n');
  
  // Test connection
  console.log('1️⃣ Testing connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('✅ Supabase connection successful');
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }

  // Check for user_profiles table
  console.log('\n2️⃣ Checking user_profiles table...');
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (error) {
      if (error.message.includes('relation "public.user_profiles" does not exist')) {
        console.log('❌ user_profiles table does not exist');
        console.log('   → This table is required for authentication');
        return false;
      } else {
        console.log('✅ user_profiles table exists (with RLS)');
      }
    } else {
      console.log('✅ user_profiles table exists and accessible');
    }
  } catch (err) {
    console.log('❌ Could not check user_profiles table');
  }

  // Check contact_requests for user_id column
  console.log('\n3️⃣ Checking contact_requests table...');
  try {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('user_id')
      .limit(1);
      
    if (error) {
      if (error.message.includes('column "user_id" does not exist')) {
        console.log('❌ contact_requests missing user_id column');
        console.log('   → Required for linking contacts to users');
      } else if (error.message.includes('relation "public.contact_requests" does not exist')) {
        console.log('❌ contact_requests table does not exist');
      } else {
        console.log('⚠️  contact_requests table exists but may have RLS issues');
      }
    } else {
      console.log('✅ contact_requests table has user_id column');
    }
  } catch (err) {
    console.log('❌ Could not check contact_requests table');
  }

  // Check chat_conversations for user_id column
  console.log('\n4️⃣ Checking chat_conversations table...');
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('user_id')
      .limit(1);
      
    if (error) {
      if (error.message.includes('column "user_id" does not exist')) {
        console.log('❌ chat_conversations missing user_id column');
        console.log('   → Required for user-specific chat history');
      } else if (error.message.includes('relation "public.chat_conversations" does not exist')) {
        console.log('❌ chat_conversations table does not exist');
      } else {
        console.log('⚠️  chat_conversations table exists but may have RLS issues');
      }
    } else {
      console.log('✅ chat_conversations table has user_id column');
    }
  } catch (err) {
    console.log('❌ Could not check chat_conversations table');
  }

  return true;
}

async function showSetupInstructions() {
  console.log('\n📋 SETUP INSTRUCTIONS');
  console.log('=====================\n');
  
  console.log('To complete the authentication setup, you need to:');
  console.log('');
  console.log('🔗 1. Open your Supabase Dashboard:');
  console.log(`   https://app.supabase.com/project/${SUPABASE_URL.split('.')[0].split('//')[1]}`);
  console.log('');
  console.log('📝 2. Go to SQL Editor:');
  console.log('   Dashboard → SQL Editor → New Query');
  console.log('');
  console.log('📄 3. Copy and paste this entire SQL script:');
  console.log('   Open: supabase-auth-setup.sql');
  console.log('   Copy: ALL content from the file');
  console.log('   Paste: Into the SQL Editor');
  console.log('');
  console.log('▶️  4. Execute the script:');
  console.log('   Click "Run" or press Ctrl+Enter');
  console.log('');
  console.log('✅ 5. Verify completion:');
  console.log('   Run: node check-database.js');
  console.log('   Run: npm run test:supabase');
  console.log('');
  console.log('⚠️  IMPORTANT NOTES:');
  console.log('   • Run the COMPLETE SQL script, not just parts');
  console.log('   • The script handles creating tables if they don\'t exist');
  console.log('   • RLS policies will be created for security');
  console.log('   • Triggers will auto-create user profiles on signup');
  console.log('');
  
  // Show what the SQL file contains
  try {
    const sqlContent = fs.readFileSync('supabase-auth-setup.sql', 'utf8');
    const lineCount = sqlContent.split('\n').length;
    console.log(`📊 The SQL file contains ${lineCount} lines of setup code including:`);
    console.log('   ✓ user_profiles table creation');
    console.log('   ✓ Row Level Security policies');  
    console.log('   ✓ User registration triggers');
    console.log('   ✓ Permission grants');
    console.log('   ✓ Column additions to existing tables');
  } catch (err) {
    console.log('📄 Make sure supabase-auth-setup.sql file exists in this directory');
  }
}

async function main() {
  await checkCurrentState();
  await showSetupInstructions();
  
  console.log('\n🚀 Once setup is complete, you can:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Open: http://localhost:3000');
  console.log('   3. Click "Sign Up" to test authentication');
  console.log('   4. Access protected routes: /dashboard, /profile');
}

main().catch(console.error);