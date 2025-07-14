# Local Testing Guide

## Overview

This guide will help you set up and test Steven Pennington's portfolio website locally with Supabase integration.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier)
- Git repository cloned locally

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Note your project URL and API keys

### 1.2 Set Up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL from `SUPABASE_SETUP.md` to create the `contact_requests` table
3. Verify the table was created in **Table Editor**

### 1.3 Get Environment Variables
1. Go to **Settings** → **API** in Supabase dashboard
2. Copy your **Project URL** and **anon public key**

---

## Step 2: Local Environment Setup

### 2.1 Create Environment File
Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp env.example .env.local
```

### 2.2 Add Your Supabase Credentials
Edit `.env.local` and add your actual Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: Gmail OAuth (for email notifications)
OAUTH_USER=your-gmail-address@gmail.com
OAUTH_CLIENT_ID=your-google-oauth-client-id
OAUTH_CLIENT_SECRET=your-google-oauth-client-secret
OAUTH_REFRESH_TOKEN=your-google-oauth-refresh-token

# Optional: Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: For local testing, you only need the Supabase variables. Gmail OAuth is optional.

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Test Supabase Connection

### 4.1 Run Supabase Test
```bash
npm run test:supabase
```

This will:
- ✅ Check environment variables
- ✅ Test database connection
- ✅ Insert a test record
- ✅ Read the test record
- ✅ Clean up the test record
- ✅ Verify table structure

### 4.2 Expected Output
```
🚀 Supabase Integration Test
=====================================

🔧 Environment Check:

Supabase URL: ✅ Set
Supabase Key: ✅ Set
Node Environment: development

🔍 Testing Supabase Connection...

1️⃣ Testing basic connection...
✅ Connection successful!

2️⃣ Testing insert operation...
✅ Test record inserted successfully!
   Record ID: 1
   Created at: 2024-01-15T10:30:00.000Z

3️⃣ Testing read operation...
✅ Read operation successful!
   Found 1 records

4️⃣ Cleaning up test record...
✅ Test record cleaned up successfully!

5️⃣ Checking table structure...
✅ Table structure is correct!

🎉 All tests passed! Supabase is ready for use.

✅ Supabase is properly configured and ready!
You can now start the development server with: npm run dev
```

### 4.3 Troubleshooting
If the test fails:
- Check your Supabase credentials in `.env.local`
- Verify the `contact_requests` table exists in Supabase
- Check the `SUPABASE_SETUP.md` guide for database setup

---

## Step 5: Start Development Server

### 5.1 Start the Server
```bash
npm run dev
```

### 5.2 Access the Application
Open your browser and go to: [http://localhost:3000](http://localhost:3000)

---

## Step 6: Test Portfolio Features

### 6.1 Navigation Test
- ✅ Home page loads correctly
- ✅ Navigation links work
- ✅ Responsive design works on mobile

### 6.2 Contact Form Test
1. Go to **Contact** page
2. Fill out the contact form with test data:
   - Name: Test User
   - Email: test@example.com
   - Company: Test Company
   - Project Type: Web Application
   - Budget: $5,000 - $10,000
   - Timeline: 1-2 months
   - Description: This is a test submission from local development
   - Message: Testing the contact form functionality

3. Click **Send Message**
4. Check for success message
5. Verify submission in Supabase dashboard

### 6.3 Verify Database Entry
1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → **contact_requests**
3. You should see your test submission
4. Check that all fields are populated correctly

### 6.4 Test Other Pages
- ✅ About page
- ✅ Portfolio page with filtering
- ✅ Services page
- ✅ All links and navigation

---

## Step 7: Test Email Integration (Optional)

### 7.1 Set Up Gmail OAuth
If you want to test email notifications:

1. Follow the Gmail OAuth setup in the deployment guides
2. Add the OAuth credentials to `.env.local`
3. Test the contact form again
4. Check your email for the notification

### 7.2 Test Without Email
The contact form will work without email integration - submissions will still be saved to Supabase.

---

## Step 8: Performance Testing

### 8.1 Build Test
```bash
npm run build
```

This should complete without errors.

### 8.2 Production Build Test
```bash
npm run build
npm run start
```

Test the production build locally.

---

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Supabase connection errors
- Check `.env.local` file exists and has correct credentials
- Verify Supabase project is active
- Check if the `contact_requests` table exists

#### 3. Contact form not working
- Check browser console for errors
- Verify Supabase test passes
- Check network tab for API calls

#### 4. Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Debug Commands

```bash
# Test Supabase connection
npm run test:supabase

# Check environment variables
node -e "console.log(require('dotenv').config({ path: '.env.local' }))"

# Check Next.js version
npx next --version

# Check Node.js version
node --version
```

---

## Next Steps

After successful local testing:

1. **Deploy to your chosen platform** (Cloudflare, AWS, or Google Cloud)
2. **Set up production environment variables**
3. **Configure custom domain**
4. **Set up monitoring and analytics**
5. **Test production deployment**

---

## Development Tips

### Hot Reload
The development server supports hot reload - changes to your code will automatically refresh the browser.

### Environment Variables
- `.env.local` is for local development only
- Never commit `.env.local` to Git
- Use platform-specific environment variable systems for production

### Database Management
- Use Supabase dashboard to view submissions
- Export data for analysis
- Set up monitoring for new submissions

### Testing Checklist
- [ ] Supabase connection test passes
- [ ] All pages load correctly
- [ ] Contact form submits successfully
- [ ] Data appears in Supabase dashboard
- [ ] Navigation works on mobile
- [ ] Build completes without errors

Your portfolio is now ready for local development and testing! 🚀 