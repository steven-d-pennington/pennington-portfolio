const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('Testing Supabase connection...\n');

// Check environment variables
console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('\n❌ Missing required environment variables');
  process.exit(1);
}

// Test browser client (anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.error('   This suggests the NEXT_PUBLIC_SUPABASE_ANON_KEY is incorrect');
      }
      return;
    }
    
    console.log('✅ Basic connection successful');
    console.log('   user_profiles table has', data?.length || 'unknown', 'records');

    // Test auth
    console.log('\n2. Testing auth...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️  No authenticated user (this is normal for server-side test)');
    } else if (user) {
      console.log('✅ Authenticated user found:', user.email);
    } else {
      console.log('ℹ️  No authenticated user');
    }

    // Test service role if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('\n3. Testing service role client...');
      
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, email, role')
        .limit(5);
      
      if (adminError) {
        console.error('❌ Service role test failed:', adminError.message);
      } else {
        console.log('✅ Service role connection successful');
        console.log('   Found', adminData?.length || 0, 'user profiles');
        if (adminData && adminData.length > 0) {
          console.log('   Sample profiles:', adminData.map(p => `${p.email} (${p.role})`));
        }
      }
    } else {
      console.log('\n3. Service role key not available - skipping admin test');
    }

    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
  }
}

testConnection();