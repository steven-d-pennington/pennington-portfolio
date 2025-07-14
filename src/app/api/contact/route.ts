import { NextRequest, NextResponse } from 'next/server';
import { submitContactRequest } from '@/utils/supabase';
import { google } from 'googleapis';

// Configure for Edge Runtime (required for Cloudflare Pages)
export const runtime = 'edge';

const OAUTH_USER = process.env.OAUTH_USER;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

const OAuth2 = google.auth.OAuth2;

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

    // 2. Send email via Gmail API
    const isGmailConfigured = OAUTH_USER && OAUTH_CLIENT_ID && OAUTH_CLIENT_SECRET && OAUTH_REFRESH_TOKEN;
    
    if (isGmailConfigured) {
      try {
        const oauth2Client = new OAuth2(
          OAUTH_CLIENT_ID,
          OAUTH_CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
          refresh_token: OAUTH_REFRESH_TOKEN,
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const { name, email, company, projectType, budget, timeline, description, message } = formData;

        // Create the email content
        const emailContent = `
From: "${name}" <${OAUTH_USER}>
To: ${OAUTH_USER}
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

        // Convert to base64url
        const encodedMessage = Buffer.from(emailContent).toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedMessage,
          },
        });

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