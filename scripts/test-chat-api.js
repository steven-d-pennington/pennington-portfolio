// Test script for the cloud engineering chat API
require('dotenv').config();

async function testChatAPI() {
  const testMessage = "What's the difference between AWS ECS and EKS?";
  
  try {
    console.log('Testing chat API with message:', testMessage);
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: testMessage,
        persistChat: false,
        conversationHistory: []
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('\n=== Chat API Response ===');
    console.log('Status:', response.status);
    console.log('Reply:', data.reply);
    
    if (data.error) {
      console.error('Error:', data.error);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Only run if called directly
if (require.main === module) {
  testChatAPI();
}

module.exports = { testChatAPI };
