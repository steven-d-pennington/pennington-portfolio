import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Legacy client for backward compatibility (non-auth features)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side Supabase client for React components
export function createSupabaseBrowser() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Middleware Supabase client
export function createSupabaseMiddleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  return { supabase, response };
}

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
  userId?: string | null;
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
          user_id: formData.userId || null,
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