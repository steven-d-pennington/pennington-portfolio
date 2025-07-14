# Cloudflare Pages Deployment Guide

## Overview
This guide covers deploying Steven Pennington's portfolio website to Cloudflare Pages, which is the recommended platform for this Next.js application due to its excellent performance, global CDN, and built-in support for Next.js.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your environment variables

## Environment Variables Setup

### Required Variables
Create these environment variables in your Cloudflare Pages dashboard:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Gmail OAuth Configuration (for contact form)
OAUTH_USER=your-gmail-address@gmail.com
OAUTH_CLIENT_ID=your-google-oauth-client-id
OAUTH_CLIENT_SECRET=your-google-oauth-client-secret
OAUTH_REFRESH_TOKEN=your-google-oauth-refresh-token
```

### How to Get Gmail OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Use [Google OAuth Playground](https://developers.google.com/oauthplayground/) to get refresh token

## Deployment Steps

### Method 1: Cloudflare Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Choose "Connect to Git"
   - Select your GitHub repository

2. **Configure Build Settings**
   - **Project name**: `steven-pennington-portfolio`
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)

3. **Environment Variables**
   - Go to Settings → Environment variables
   - Add all required environment variables listed above
   - Set them for both "Production" and "Preview" environments

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Method 2: Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   wrangler pages deploy .next --project-name=steven-pennington-portfolio
   ```

## Custom Domain Setup

1. **Add Custom Domain**
   - Go to your Pages project dashboard
   - Navigate to "Custom domains"
   - Click "Set up a custom domain"
   - Enter your domain (e.g., `portfolio.stevenpennington.com`)

2. **DNS Configuration**
   - Cloudflare will automatically configure DNS if your domain is on Cloudflare
   - For external domains, add a CNAME record pointing to your Pages URL

## Performance Optimization

### Cloudflare Pages Features
- **Global CDN**: Automatic global distribution
- **Edge Functions**: API routes run at the edge
- **Image Optimization**: Automatic image optimization
- **Caching**: Intelligent caching strategies

### Recommended Settings
- Enable "Auto Minify" for JavaScript, CSS, and HTML
- Enable "Brotli" compression
- Set appropriate cache headers

## Monitoring & Analytics

1. **Cloudflare Analytics**
   - Built-in analytics in your Pages dashboard
   - Real-time visitor data
   - Performance metrics

2. **Error Monitoring**
   - Check build logs in the Pages dashboard
   - Monitor function logs for API routes

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

2. **Environment Variables**
   - Ensure all variables are set correctly
   - Check for typos in variable names
   - Verify Supabase and Gmail credentials

3. **API Routes Not Working**
   - Verify redirects are configured correctly
   - Check function logs in Cloudflare dashboard
   - Ensure environment variables are accessible

### Debug Commands
```bash
# Test build locally
npm run build

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test API routes locally
npm run dev
```

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Cloudflare's environment variable system
   - Rotate credentials regularly

2. **CORS Configuration**
   - Configure CORS headers if needed
   - Restrict API access as appropriate

3. **Rate Limiting**
   - Consider implementing rate limiting for contact form
   - Use Cloudflare's built-in DDoS protection

## Cost Optimization

- **Cloudflare Pages**: Free tier includes 500 builds/month
- **Bandwidth**: 100GB/month free
- **Function Calls**: 100,000 requests/day free
- **Custom Domains**: Unlimited on free tier

## Backup & Recovery

1. **Code Backup**
   - Ensure code is in Git repository
   - Use GitHub for version control

2. **Environment Variables**
   - Document all environment variables
   - Keep secure backup of credentials

3. **Database Backup**
   - Configure Supabase backups
   - Export data regularly

## Next Steps

After deployment:
1. Test all functionality (contact form, navigation)
2. Set up monitoring and alerts
3. Configure custom domain
4. Set up SSL certificate (automatic with Cloudflare)
5. Test performance and optimize as needed

## Support Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Community](https://community.cloudflare.com/) 