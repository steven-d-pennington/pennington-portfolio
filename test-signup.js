#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🧪 Testing Signup Flow');
console.log('====================\n');

async function testSignup() {
  const testEmail = `test.${Date.now()}@gmail.com`;
  const testPassword = 'TestPassword123!';
  
  console.log(`📧 Testing signup with: ${testEmail}`);
  console.log('🔒 Password: TestPassword123!\n');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });
    
    if (error) {
      console.error('❌ Signup failed:', error.message);
      return;
    }
    
    console.log('📊 Signup Result:');
    console.log('================');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Email Confirmed:', data.user?.email_confirmed_at ? 'YES' : 'NO');
    console.log('Session Created:', data.session ? 'YES' : 'NO');
    
    if (data.user?.email_confirmed_at) {
      console.log('\n✅ Email confirmation is DISABLED');
      console.log('   → User can sign in immediately');
      console.log('   → Good for development/testing');
    } else {
      console.log('\n📧 Email confirmation is ENABLED');
      console.log('   → User must check email and click confirmation link');
      console.log('   → User cannot sign in until email is confirmed');
      console.log('   → Check your email for confirmation link');
    }
    
    if (data.session) {
      console.log('\n🎯 User is automatically signed in after signup');
    } else {
      console.log('\n🔒 User must confirm email before signing in');
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testSignup();