// Test script for the Gmail integration contact API
require('dotenv').config({ path: '.env.local' });

async function testGmailAPI() {
  const testContactData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    projectType: 'Cloud Migration',
    budget: '$10,000 - $25,000',
    timeline: '3-6 months',
    description: 'This is a test contact form submission to verify Gmail integration works properly.',
    message: 'Additional test message for Gmail API verification.'
  };
  
  try {
    console.log('Testing Gmail contact API with data:');
    console.log('Name:', testContactData.name);
    console.log('Email:', testContactData.email);
    console.log('Project Type:', testContactData.projectType);
    console.log('Description:', testContactData.description);
    console.log('\n🔄 Sending contact form submission...\n');
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContactData),
    });

    const data = await response.json();
    
    console.log('=== Gmail Contact API Response ===');
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Response:', data);
      
      if (data.message) {
        console.log('📧 Gmail Status:', data.message);
      }
      
      if (data.supabaseSuccess) {
        console.log('💾 Supabase Status: Contact saved to database');
      }
      
      console.log('\n🎉 Gmail integration test PASSED!');
      console.log('📩 Check your Gmail inbox for the test email');
      
    } else {
      console.error('❌ Error Response:', data);
      
      if (data.error) {
        console.error('Error Details:', data.error);
      }
      
      if (data.gmailError) {
        console.error('Gmail Error:', data.gmailError);
      }
      
      if (data.supabaseError) {
        console.error('Supabase Error:', data.supabaseError);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed with network error:', error.message);
    console.error('\nPossible issues:');
    console.error('- Development server not running (npm run dev)');
    console.error('- Environment variables not configured');
    console.error('- Network connectivity issues');
  }
}

async function testGmailAuthOnly() {
  console.log('\n=== Testing Gmail OAuth2 Authentication ===');
  
  const requiredEnvVars = [
    'OAUTH_USER',
    'OAUTH_CLIENT_ID', 
    'OAUTH_CLIENT_SECRET',
    'OAUTH_REFRESH_TOKEN'
  ];
  
  console.log('Checking environment variables...');
  
  let allPresent = true;
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${envVar === 'OAUTH_CLIENT_SECRET' || envVar === 'OAUTH_REFRESH_TOKEN' ? '***HIDDEN***' : value}`);
    } else {
      console.log(`❌ ${envVar}: NOT SET`);
      allPresent = false;
    }
  });
  
  if (!allPresent) {
    console.log('\n❌ Missing required environment variables for Gmail integration');
    return false;
  }
  
  console.log('\n✅ All Gmail OAuth2 environment variables are configured');
  return true;
}

// Function to test just the API endpoint without sending email
async function testContactAPIOnly() {
  const testData = {
    name: 'API Test User',
    email: 'apitest@example.com', 
    description: 'API test - no email should be sent'
  };

  try {
    console.log('\n=== Testing Contact API Endpoint ===');
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseText = await response.text();
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response Body:', responseText);
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed JSON:', data);
      } catch (e) {
        console.log('Failed to parse JSON response');
      }
    }
    
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Gmail Integration Test Suite');
  console.log('================================\n');
  
  // Test 1: Environment variables
  const envOk = await testGmailAuthOnly();
  
  if (!envOk) {
    console.log('\n❌ Environment test failed. Skipping API tests.');
    return;
  }
  
  // Test 2: API endpoint basic connectivity  
  await testContactAPIOnly();
  
  // Test 3: Full Gmail integration test
  console.log('\n' + '='.repeat(50));
  console.log('⚠️  WARNING: The next test will send a real email!');
  console.log('='.repeat(50));
  
  // Add a small delay to let user see the warning
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await testGmailAPI();
}

// Only run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--env-only')) {
    testGmailAuthOnly();
  } else if (args.includes('--api-only')) {
    testContactAPIOnly();
  } else if (args.includes('--full')) {
    testGmailAPI();
  } else {
    runAllTests();
  }
}

module.exports = { 
  testGmailAPI, 
  testGmailAuthOnly, 
  testContactAPIOnly,
  runAllTests 
};
