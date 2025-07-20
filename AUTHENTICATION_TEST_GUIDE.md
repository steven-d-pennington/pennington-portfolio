# Authentication Testing Guide

This guide provides a comprehensive checklist to test all authentication features implemented in your portfolio website.

## Prerequisites

Before testing, ensure you've completed these setup steps:

### 1. Database Setup
- [ ] Run the `supabase-auth-setup.sql` script in your Supabase SQL Editor
- [ ] Verify all tables and policies were created successfully
- [ ] Check that authentication is enabled in Supabase project settings

### 2. Environment Variables
Ensure these environment variables are set in your deployment environment:

```env
# Required for authentication
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional for full functionality
OPENAI_API_KEY=your_openai_api_key
GMAIL_USER_EMAIL=your_gmail_email
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
```

### 3. Start the Development Server
```bash
npm run dev
```

## Testing Checklist

### Phase 1: Basic Authentication Flow

#### 1.1 User Registration
- [ ] Navigate to the homepage
- [ ] Click "Sign Up" button in the navigation
- [ ] Fill out the registration form with valid information
- [ ] Submit the form
- [ ] Verify success message appears
- [ ] Check email for confirmation link (if email verification is enabled)
- [ ] Click confirmation link to verify email
- [ ] Verify you're automatically signed in after confirmation

#### 1.2 User Sign In
- [ ] Sign out if currently signed in
- [ ] Click "Sign In" button
- [ ] Enter valid credentials
- [ ] Verify successful sign in
- [ ] Verify user menu appears in navigation
- [ ] Verify user avatar/initials display correctly

#### 1.3 Password Reset
- [ ] Sign out if currently signed in
- [ ] Click "Sign In" then "Reset Password"
- [ ] Enter your email address
- [ ] Check email for reset link
- [ ] Click reset link and set new password
- [ ] Sign in with new password

### Phase 2: Navigation and User Interface

#### 2.1 Navigation Updates
- [ ] When signed out: Verify "Sign In" and "Sign Up" buttons are visible
- [ ] When signed in: Verify user menu with avatar/initials appears
- [ ] Click user menu to verify dropdown opens
- [ ] Verify dropdown contains: Profile Settings, Dashboard, Sign Out
- [ ] Verify protected routes (Dashboard, Profile) appear in main navigation when signed in
- [ ] Verify protected routes are hidden when signed out

#### 2.2 Mobile Navigation
- [ ] Test on mobile/narrow screen
- [ ] Open mobile menu
- [ ] When signed out: Verify auth buttons in mobile menu
- [ ] When signed in: Verify user info and menu items in mobile menu
- [ ] Verify sign out works from mobile menu

### Phase 3: Protected Routes and Middleware

#### 3.1 Route Protection
- [ ] While signed out, try to access `/dashboard`
- [ ] Verify you're redirected to homepage with auth required parameter
- [ ] Sign in and verify you're redirected back to `/dashboard`
- [ ] While signed out, try to access `/profile`
- [ ] Verify redirect behavior works correctly

#### 3.2 Dashboard Page
- [ ] Sign in and navigate to `/dashboard`
- [ ] Verify dashboard loads without errors
- [ ] Verify user information displays correctly
- [ ] Verify account statistics show proper values
- [ ] Test all quick action links work

#### 3.3 Profile Page
- [ ] Navigate to `/profile`
- [ ] Verify profile information displays correctly
- [ ] Click "Edit Profile" and modify your name
- [ ] Save changes and verify success message
- [ ] Refresh page and verify changes persisted
- [ ] Verify account information section shows correct dates

### Phase 4: Feature Integration

#### 4.1 Chat Integration
- [ ] Sign out and use the chat feature
- [ ] Verify chat works for anonymous users
- [ ] Sign in and use chat feature
- [ ] Verify chat still works for authenticated users
- [ ] Check Supabase database to verify:
  - Anonymous chats have `user_id` as `null`
  - Authenticated chats have proper `user_id`

#### 4.2 Contact Form Integration
- [ ] Sign out and submit contact form
- [ ] Verify form submission works
- [ ] Sign in and submit contact form
- [ ] Verify form submission still works
- [ ] Check Supabase database to verify:
  - Anonymous submissions have `user_id` as `null`
  - Authenticated submissions have proper `user_id`

### Phase 5: Security Testing

#### 5.1 Session Management
- [ ] Sign in and verify session persists after page refresh
- [ ] Close browser tab, reopen, and verify still signed in
- [ ] Sign out and verify session is cleared
- [ ] Verify you can't access protected routes after signing out

#### 5.2 Database Security (RLS)
Using Supabase dashboard or SQL queries, verify:
- [ ] Users can only see their own profile in `user_profiles` table
- [ ] Users can only see their own contact requests
- [ ] Users can only see their own chat conversations
- [ ] Anonymous users cannot see any user-specific data

#### 5.3 API Security
- [ ] Try accessing protected API endpoints without authentication
- [ ] Verify proper error handling and no sensitive data exposure
- [ ] Test with invalid/expired tokens

### Phase 6: Error Handling

#### 6.1 Authentication Errors
- [ ] Try signing in with invalid email
- [ ] Try signing in with wrong password
- [ ] Verify appropriate error messages appear
- [ ] Try signing up with existing email
- [ ] Try signing up with weak password

#### 6.2 Network Errors
- [ ] Simulate network issues during sign in
- [ ] Verify loading states and error messages
- [ ] Test form validation for required fields

### Phase 7: Theme and Dark Mode

#### 7.1 Theme Compatibility
- [ ] Test authentication flows in light theme
- [ ] Switch to dark theme
- [ ] Test authentication flows in dark theme
- [ ] Verify all modals and forms display correctly in both themes

## Database Verification Queries

Run these queries in Supabase SQL Editor to verify data integrity:

```sql
-- Check user profiles are created correctly
SELECT id, email, full_name, role, created_at 
FROM public.user_profiles 
ORDER BY created_at DESC;

-- Check contact requests with user association
SELECT name, email, user_id, created_at 
FROM public.contact_requests 
ORDER BY created_at DESC;

-- Check chat conversations with user association
SELECT LEFT(user_message, 50) as message_preview, user_id, created_at 
FROM public.chat_conversations 
ORDER BY created_at DESC;

-- Verify RLS policies are working
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'contact_requests', 'chat_conversations');
```

## Common Issues and Solutions

### Issue: "Invalid JWT" Errors
- Check environment variables are correctly set
- Verify Supabase URL and keys are valid
- Clear browser cookies and localStorage
- Restart development server

### Issue: Protected Routes Not Working
- Check middleware configuration
- Verify route patterns in middleware matcher
- Check browser network tab for authentication requests

### Issue: Database Connection Errors
- Verify Supabase project is running
- Check RLS policies are properly configured
- Ensure service role key has proper permissions

### Issue: User Profiles Not Created
- Check the `handle_new_user()` trigger is installed
- Verify the trigger fires on user registration
- Check for errors in Supabase logs

## Performance Testing

- [ ] Test authentication flow with slow network connection
- [ ] Verify loading states appear appropriately
- [ ] Check for memory leaks during sign in/out cycles
- [ ] Test with multiple browser tabs open

## Browser Compatibility

Test the authentication flow in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Final Verification

- [ ] All authentication flows work without errors
- [ ] User data is properly associated with authenticated users
- [ ] Protected routes are secured
- [ ] Database RLS policies are functioning
- [ ] Error handling is appropriate
- [ ] UI/UX is consistent across themes
- [ ] Performance is acceptable

## Next Steps After Testing

Once all tests pass:

1. **Deploy to Production**: Ensure environment variables are set in your production environment
2. **Monitor Logs**: Watch for authentication-related errors in production
3. **User Feedback**: Collect feedback from real users about the authentication experience
4. **Security Review**: Consider a security audit for production applications
5. **Documentation**: Update your README.md with authentication instructions

## Troubleshooting Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/authentication)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

---

**Note**: This is a comprehensive testing guide. Prioritize the Phase 1-4 tests for basic functionality verification. Phases 5-7 are important for production readiness but may be done iteratively.