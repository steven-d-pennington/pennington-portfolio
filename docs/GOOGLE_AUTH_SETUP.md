# Google Authentication Setup Guide

## Status: TEMPORARILY DISABLED (2025-01-24)

Google OAuth authentication has been temporarily disabled because the Google OAuth provider is not configured in Supabase. The frontend code is complete and functional - only backend configuration is needed.

## Files Modified for Disabling

The following files have Google auth commented out with detailed instructions for re-enabling:

1. **`src/components/AuthProvider.tsx`**
   - `signInWithGoogle` function commented out
   - Type definition updated
   - Export statements updated

2. **`src/components/AuthModal.tsx`**
   - Google sign-in button commented out
   - "OR" divider commented out
   - Import statement updated

3. **`src/app/login/page.tsx`**
   - Google sign-in button commented out
   - `handleGoogleSignIn` function commented out
   - Import statement updated

## Re-enabling Google Authentication

When you're ready to re-enable Google auth, follow these steps:

### Step 1: Configure Google Cloud Console

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project** (or create a new one)
3. **Enable Google+ API**:
   - Navigate to APIs & Services → Library
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://[your-supabase-project].supabase.co/auth/v1/callback
     ```
   - Note down the Client ID and Client Secret

### Step 2: Configure Supabase Dashboard

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → Providers**
3. **Enable Google provider**
4. **Add your Google OAuth credentials**:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
5. **Save the configuration**

### Step 3: Update Code

1. **In `src/components/AuthProvider.tsx`**:
   - Uncomment the `signInWithGoogle` function (lines ~281-289)
   - Add `signInWithGoogle: () => Promise<{ error: AuthError | null }>;` back to `AuthContextType`
   - Add `signInWithGoogle,` back to the value object
   - Update `useAuthActions()` to include `signInWithGoogle`

2. **In `src/components/AuthModal.tsx`**:
   - Uncomment the "OR" divider section
   - Uncomment the Google sign-in button
   - Update the import: `const { signUp, signIn, resetPassword, signInWithGoogle } = useAuthActions();`

3. **In `src/app/login/page.tsx`**:
   - Update import: `const { signInWithGoogle, signIn } = useAuthActions();`
   - Uncomment the `handleGoogleSignIn` function
   - Uncomment the Google sign-in button section

### Step 4: Test the Integration

1. **Test Google OAuth flow**:
   - Click "Sign in with Google"
   - Verify redirect to Google's consent screen
   - Confirm successful authentication and redirect back
   - Check that user profile is created in Supabase

2. **Verify in Supabase**:
   - Check Authentication → Users for new Google OAuth users
   - Verify user_profiles table has correct data

## Environment Variables

No additional environment variables are required for Google OAuth with Supabase. Supabase handles the OAuth flow using the credentials configured in the dashboard.

## Current Gmail API vs Google OAuth

**Important**: This project already has Gmail API credentials configured for sending emails (check your `.env.local` file).

These are **different** from the Google OAuth credentials needed for authentication. The Gmail API credentials are for sending emails, while Google OAuth credentials are for user authentication.

## Troubleshooting

### Common Issues:

1. **"OAuth provider not configured"**
   - Ensure Google provider is enabled in Supabase Dashboard
   - Verify Client ID and Secret are correctly entered

2. **"Redirect URI mismatch"**
   - Check that redirect URI in Google Cloud Console matches:
     `https://[your-project].supabase.co/auth/v1/callback`

3. **"Access blocked: This app's request is invalid"**
   - Verify Google+ API is enabled
   - Check OAuth consent screen configuration

### Testing Checklist:

- [ ] Google Cloud Console OAuth credentials created
- [ ] Supabase Google provider enabled and configured
- [ ] Code uncommented and updated
- [ ] Google sign-in button appears on login page
- [ ] OAuth flow redirects to Google successfully
- [ ] Users can authenticate and are redirected back
- [ ] User profiles are created in database

## Code Search Pattern

To find all Google auth related code for re-enabling, search for:
- `GOOGLE AUTH TEMPORARILY DISABLED`
- `signInWithGoogle`
- `Sign in with Google`

## Implementation Notes

The Google OAuth implementation uses Supabase's built-in OAuth handling, which means:
- No need to manually handle OAuth tokens
- User sessions are managed by Supabase
- User metadata is automatically populated
- Redirect handling is built into the auth callback

This is a clean, production-ready implementation that just needs backend configuration to function.