import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// These environment variables should be set in your deployment environment
// For local development, you can use a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a single supabase client for the entire app
// This will be a mock client if environment variables are not set
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to submit a contact/quote request
export async function submitContactRequest(formData: {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description: string;
  message?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('contact_requests')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          project_type: formData.projectType || null,
          budget: formData.budget || null,
          timeline: formData.timeline || null,
          description: formData.description,
          message: formData.message || null,
          created_at: new Date().toISOString(),
          status: 'new'
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact request:', error);
    return { success: false, error };
  }
}