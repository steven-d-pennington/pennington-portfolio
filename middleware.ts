import { type NextRequest } from 'next/server';
import { createSupabaseMiddleware } from '@/utils/supabase';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddleware(request);

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Define protected routes (exclude client routes)
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  const authRoutes = ['/login', '/signup'];
  const clientRoutes = ['/client-dashboard', '/client-login'];
  
  // Check if the current route is a client route (handled separately)
  const isClientRoute = clientRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Skip middleware for client routes - they have their own auth handling
  if (isClientRoute) {
    return response;
  }
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If accessing a protected route without authentication
  if (isProtectedRoute && !session) {
    // Store the attempted URL to redirect back after login
    url.pathname = '/';
    url.searchParams.set('redirectTo', pathname);
    url.searchParams.set('authRequired', 'true');
    return Response.redirect(url);
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && session) {
    // Check if there's a redirect URL from the original request
    const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';
    url.pathname = redirectTo;
    url.searchParams.delete('redirectTo');
    url.searchParams.delete('authRequired');
    return Response.redirect(url);
  }

  // Handle auth callback - this is important for OAuth flows
  if (pathname === '/auth/callback') {
    const code = url.searchParams.get('code');
    const next = url.searchParams.get('next') ?? '/dashboard';

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Redirect to the intended destination
        url.pathname = next;
        url.searchParams.delete('code');
        url.searchParams.delete('next');
        return Response.redirect(url);
      }
    }

    // If there's an error or no code, redirect to home with error
    url.pathname = '/';
    url.searchParams.set('error', 'auth_error');
    return Response.redirect(url);
  }

  // Return the response with updated cookies
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};