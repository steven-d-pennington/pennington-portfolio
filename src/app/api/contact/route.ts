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
    
    // Submit to Supabase
    const result = await submitContactRequest(formData);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to submit contact request' },
        { status: 500 }
      );
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