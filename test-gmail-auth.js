const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const OAUTH_USER = process.env.OAUTH_USER;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

console.log('Testing Gmail API authentication...');
console.log('User:', OAUTH_USER);
console.log('Client ID:', OAUTH_CLIENT_ID ? `${OAUTH_CLIENT_ID.substring(0, 20)}...` : 'NOT SET');
console.log('Client Secret:', OAUTH_CLIENT_SECRET ? `${OAUTH_CLIENT_SECRET.substring(0, 10)}...` : 'NOT SET');
console.log('Refresh Token:', OAUTH_REFRESH_TOKEN ? `${OAUTH_REFRESH_TOKEN.substring(0, 20)}...` : 'NOT SET');

async function testAuth() {
  try {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      OAUTH_CLIENT_ID,
      OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: OAUTH_REFRESH_TOKEN,
    });

    console.log('\nTesting access token generation...');
    const accessToken = await oauth2Client.getAccessToken();
    console.log('✅ Access token obtained successfully!');
    console.log('Token:', accessToken.token ? `${accessToken.token.substring(0, 20)}...` : 'EMPTY');

    // Test Gmail API access
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('✅ Gmail API access successful!');
    console.log('Email address:', profile.data.emailAddress);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testAuth();
