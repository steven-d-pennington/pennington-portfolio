import { NextRequest, NextResponse } from 'next/server';
import { submitContactRequest } from '@/utils/supabase';

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
    
    // Check if Supabase is configured
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder-url.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key';
    
    if (isSupabaseConfigured) {
      // Submit to Supabase if configured
      const result = await submitContactRequest(formData);
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: 'Failed to submit contact request' },
          { status: 500 }
        );
      }
    } else {
      // Log the form data if Supabase is not configured
      console.log('Contact form submission (Supabase not configured):', formData);
      
      // In a real environment, you might want to save this to a file or another storage
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return NextResponse.json({ success: true, message: 'Contact request submitted successfully' });
  } catch (error) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}