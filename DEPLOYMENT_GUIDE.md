# Deployment Guide for Pennington Portfolio

## Option 1: Deploy to Vercel (Recommended)

Vercel is perfect for Next.js applications and handles API routes automatically.

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### Step 2: Connect GitHub Repository
1. In Vercel dashboard, click "New Project"
2. Import your `pennington-portfolio` repository
3. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables
In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
GMAIL_USER_EMAIL=your_gmail_user_email
```

### Step 4: Deploy
- Vercel will automatically deploy when you push to the main branch
- Your app will be available at `https://pennington-portfolio.vercel.app`

## Option 2: Deploy to Netlify

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account

### Step 2: Connect Repository
1. Click "New site from Git"
2. Choose GitHub and select your repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Step 3: Configure Environment Variables
Add the same environment variables as listed above in Netlify's site settings.

## Option 3: Deploy to Railway

Railway is great for full-stack applications:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Deploy from GitHub repository
4. Add environment variables
5. Railway automatically detects Next.js

## Recommended: Use Vercel

Vercel is built by the creators of Next.js and provides:
- ✅ Automatic deployments from GitHub
- ✅ Perfect API route handling
- ✅ Free tier for hobby projects
- ✅ Built-in analytics and monitoring
- ✅ Zero configuration needed

Your portfolio will work perfectly on any of these platforms, but Vercel is the most seamless experience for Next.js applications.
