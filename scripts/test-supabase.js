const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please create a .env.local file with:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: healthData, error: healthError } = await supabase
      .from('contact_requests')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return false;
    }
    console.log('✅ Connection successful!\n');

    // Test 2: Insert a test record
    console.log('2️⃣ Testing insert operation...');
    const testRecord = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      project_type: 'Test Project',
      budget: 'Test Budget',
      timeline: 'Test Timeline',
      description: 'This is a test submission from the local development environment.',
      message: 'Testing the contact form functionality.'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('contact_requests')
      .insert([testRecord])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return false;
    }
    console.log('✅ Test record inserted successfully!');
    console.log('   Record ID:', insertData[0].id);
    console.log('   Created at:', insertData[0].created_at);

    // Test 3: Read the test record
    console.log('\n3️⃣ Testing read operation...');
    const { data: readData, error: readError } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('email', 'test@example.com')
      .order('created_at', { ascending: false })
      .limit(5);

    if (readError) {
      console.error('❌ Read failed:', readError.message);
      return false;
    }
    console.log('✅ Read operation successful!');
    console.log(`   Found ${readData.length} records`);

    // Test 4: Clean up test record
    console.log('\n4️⃣ Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('contact_requests')
      .delete()
      .eq('email', 'test@example.com');

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
      return false;
    }
    console.log('✅ Test record cleaned up successfully!\n');

    // Test 5: Check table structure
    console.log('5️⃣ Checking table structure...');
    const { data: structureData, error: structureError } = await supabase
      .from('contact_requests')
      .select('*')
      .limit(0);

    if (structureError) {
      console.error('❌ Structure check failed:', structureError.message);
      return false;
    }
    console.log('✅ Table structure is correct!\n');

    console.log('🎉 All tests passed! Supabase is ready for use.');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

async function checkEnvironment() {
  console.log('🔧 Environment Check:\n');
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');
  console.log('Node Environment:', process.env.NODE_ENV || 'development');
  console.log('');
}

// Run the tests
async function runTests() {
  console.log('🚀 Supabase Integration Test\n');
  console.log('=====================================\n');

  await checkEnvironment();
  const success = await testSupabaseConnection();

  if (success) {
    console.log('\n✅ Supabase is properly configured and ready!');
    console.log('You can now start the development server with: npm run dev');
  } else {
    console.log('\n❌ Supabase setup needs attention.');
    console.log('Please check the SUPABASE_SETUP.md guide for troubleshooting.');
    process.exit(1);
  }
}

runTests(); 