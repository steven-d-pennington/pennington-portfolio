# Configure Supabase Auth Redirect URLs

## IMPORTANT: Update Your Supabase Auth Settings

### Step 1: Go to Supabase Dashboard
https://app.supabase.com/project/htfbommrxngachnglbwk

### Step 2: Navigate to Authentication Settings
Dashboard → Authentication → URL Configuration

### Step 3: Update Site URL and Redirect URLs

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs (Add these):**
```
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/**
```

### Step 4: Save Changes
Click "Save" to apply the configuration.

## Why This is Important

Without the correct redirect URLs configured:
- ❌ Email confirmation links redirect to wrong URLs
- ❌ OTP tokens get expired/invalid errors  
- ❌ Users get stuck in auth loops

With correct configuration:
- ✅ Email links redirect to `/auth/callback`
- ✅ Callback handler processes the confirmation
- ✅ Users see friendly success/error messages
- ✅ Automatic redirect to dashboard after confirmation

## Additional Configuration for Production

When you deploy, add your production URLs:

**Production Site URL:**
```
https://yourdomain.com
```

**Production Redirect URLs:**
```
https://yourdomain.com/auth/callback
https://yourdomain.com/dashboard  
https://yourdomain.com/**
```