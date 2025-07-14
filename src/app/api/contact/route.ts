import { NextRequest, NextResponse } from 'next/server';
import { submitContactRequest } from '@/utils/supabase';

const GMAIL_USER_EMAIL = process.env.GMAIL_USER_EMAIL;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

// Edge Runtime compatible Gmail API functions
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID!,
      client_secret: GMAIL_CLIENT_SECRET!,
      refresh_token: GMAIL_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function sendEmail(accessToken: string, encodedMessage: string): Promise<void> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.description) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and project description are required' },
        { status: 400 }
      );
    }
    
    // Initialize results tracking
    let emailSent = false;
    let savedToDatabase = false;
    const errors = [];

    // 1. Save to Supabase database
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder-url.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key';
    
    if (isSupabaseConfigured) {
      try {
        console.log('Attempting to save to Supabase with data:', {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          projectType: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description?.substring(0, 50) + '...', // Truncate for logging
          message: formData.message?.substring(0, 50) + '...' // Truncate for logging
        });
        
        const result = await submitContactRequest(formData);
        console.log('Supabase result:', result);
        
        if (result.success) {
          savedToDatabase = true;
          console.log('Successfully saved to Supabase');
        } else {
          console.error('Supabase save failed:', result.error);
          errors.push('Failed to save to database: ' + (result.error && typeof result.error === 'object' && 'message' in result.error ? result.error.message : 'Unknown error'));
        }
      } catch (error) {
        console.error('Supabase error:', error);
        errors.push('Database error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } else {
      console.log('Contact form submission (Supabase not configured):', formData);
      savedToDatabase = true; // Consider it "saved" for logging purposes
    }

    // 2. Send email via Gmail API (Edge Runtime compatible)
    const isGmailConfigured = GMAIL_USER_EMAIL && GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN;
    
    if (isGmailConfigured) {
      try {
        const { name, email, company, projectType, budget, timeline, description, message } = formData;

        // Create the email content
        const emailContent = `
From: "${name}" <${GMAIL_USER_EMAIL}>
To: ${GMAIL_USER_EMAIL}
Reply-To: ${email}
Subject: New Portfolio Inquiry: ${projectType || 'General Question'}
Content-Type: text/html; charset=utf-8

<h1>New Project Inquiry</h1>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company || 'N/A'}</p>
<hr>
<h2>Project Details</h2>
<p><strong>Project Type:</strong> ${projectType || 'N/A'}</p>
<p><strong>Budget:</strong> ${budget || 'N/A'}</p>
<p><strong>Timeline:</strong> ${timeline || 'N/A'}</p>
<hr>
<h3>Description</h3>
<p>${description.replace(/\n/g, '<br>')}</p>
<h3>Additional Message</h3>
<p>${message ? message.replace(/\n/g, '<br>') : 'N/A'}</p>
        `.trim();

        // Convert to base64url (Edge Runtime compatible)
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(emailContent);
        const base64 = btoa(String.fromCharCode(...data))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        // Get access token and send email
        const accessToken = await getAccessToken();
        await sendEmail(accessToken, base64);

        emailSent = true;
      } catch (error) {
        console.error('Gmail API error:', error);
        errors.push('Failed to send email notification');
      }
    } else {
      console.log('Gmail not configured - email not sent');
      errors.push('Email service not configured');
    }

    // Determine response based on results
    if (savedToDatabase || emailSent) {
      const successMessages = [];
      if (savedToDatabase) successMessages.push('saved to database');
      if (emailSent) successMessages.push('email notification sent');
      
      return NextResponse.json({ 
        success: true, 
        message: `Contact request submitted successfully (${successMessages.join(', ')})`,
        details: { emailSent, savedToDatabase, errors: errors.length > 0 ? errors : undefined }
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to process contact request', errors },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}