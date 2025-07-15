# Deployment Guide for Pennington Portfolio

This guide covers deployment options for the portfolio website with full functionality including AI chat assistant, contact form with Gmail integration, and Supabase database.

## 🎯 Quick Start (Vercel - Recommended)

Vercel is the recommended platform as it's built by the Next.js team and handles all features seamlessly.

### Step 1: Prerequisites
- GitHub account with your portfolio repository
- Vercel account (free tier available)
- All environment variables ready (see [Environment Variables](#environment-variables) section)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" and import `pennington-portfolio` repository
3. Vercel will auto-detect Next.js settings - no changes needed
4. Add environment variables (see section below)
5. Click "Deploy"

### Step 3: Configure Environment Variables
In your Vercel project dashboard, go to Settings > Environment Variables and add:

```bash
# Database Configuration (Required for contact form and chat persistence)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Chat Assistant (Required for chat feature)
OPENAI_API_KEY=sk-proj-your_openai_api_key

# Email Integration (Required for contact form)
GMAIL_USER_EMAIL=your-email@gmail.com
GMAIL_CLIENT_ID=your_google_oauth_client_id
GMAIL_CLIENT_SECRET=your_google_oauth_client_secret
GMAIL_REFRESH_TOKEN=your_google_oauth_refresh_token
```

### Step 4: Automatic Deployments
- Vercel automatically deploys on every push to your main branch
- Preview deployments are created for pull requests
- Your site will be available at `https://your-project.vercel.app`

---

## 🔧 Environment Variables

All deployment platforms require these environment variables for full functionality:

### Required Variables

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Database connection | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database public access | Supabase project API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Database admin access | Supabase project API settings |
| `OPENAI_API_KEY` | AI chat assistant | OpenAI API dashboard |
| `GMAIL_USER_EMAIL` | Email sending | Your Gmail address |
| `GMAIL_CLIENT_ID` | Gmail API access | Google Cloud Console |
| `GMAIL_CLIENT_SECRET` | Gmail API access | Google Cloud Console |
| `GMAIL_REFRESH_TOKEN` | Gmail API access | OAuth2 flow |

### Setup Guides
- **Supabase**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Gmail API**: See [LOCAL_TESTING.md](./LOCAL_TESTING.md)
- **OpenAI API**: Get key from [platform.openai.com](https://platform.openai.com/api-keys)

---

## 🌐 Alternative Deployment Platforms

### Netlify

Netlify supports Next.js with serverless functions but requires additional configuration.

**Steps:**
1. Go to [netlify.com](https://netlify.com) and connect your GitHub repository
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `.netlify/functions`
3. Add environment variables in Site Settings > Environment Variables
4. Deploy

**Note**: Netlify may require additional configuration for API routes and dynamic functionality.

### Railway

Railway provides full-stack deployment with automatic database provisioning.

**Steps:**
1. Go to [railway.app](https://railway.app) and connect your GitHub repository
2. Railway auto-detects Next.js and configures build settings
3. Add environment variables in the Variables tab
4. Optionally add a PostgreSQL database service
5. Deploy

**Pros**: Excellent for full-stack apps, built-in database options
**Cons**: Limited free tier compared to Vercel

### AWS (Advanced)

For enterprise deployments, use the provided AWS CloudFormation templates that deploy to ECS Fargate.

**Files included:**
- `aws/cloudformation/main.yaml` - Main infrastructure with environment variables
- `aws/cloudformation/vpc.yaml` - Network configuration  
- `aws/cloudformation/ecr.yaml` - Container registry
- `aws/deploy.ps1` - PowerShell deployment script
- `aws/deploy.sh` - Bash deployment script

**Prerequisites:**
1. AWS CLI installed and configured with appropriate permissions
2. Docker installed and running
3. All environment variables ready (see Environment Variables section)

**Deployment Options:**

**Option 1: PowerShell Script (Windows)**
```powershell
./aws/deploy.ps1 -Environment production -Region us-east-1 -DomainName your-domain.com -CertificateArn arn:aws:acm:... -OpenAIApiKey sk-proj-... -SupabaseUrl https://your-project.supabase.co -SupabaseAnonKey your_key -GmailUserEmail your@email.com -GmailClientId your_client_id -GmailClientSecret your_secret -GmailRefreshToken your_token
```

**Option 2: Bash Script (Linux/Mac)**
```bash
# Set environment variables first
export OPENAI_API_KEY="sk-proj-your_openai_api_key"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your_supabase_anon_key"
export GMAIL_USER_EMAIL="your-email@gmail.com"
export GMAIL_CLIENT_ID="your_google_oauth_client_id"
export GMAIL_CLIENT_SECRET="your_google_oauth_client_secret"
export GMAIL_REFRESH_TOKEN="your_google_oauth_refresh_token"

# Run deployment
./aws/deploy.sh production us-east-1 your-domain.com arn:aws:acm:...
```

**What the deployment creates:**
- VPC with public/private subnets
- ECR repository for container images
- ECS Fargate cluster and service
- Application Load Balancer with SSL/TLS
- CloudWatch logs and monitoring
- Security groups with proper access controls

**Best for**: High-traffic production deployments, enterprise requirements, custom networking needs

---

## 🚧 Feature Compatibility by Platform

| Feature | Vercel | Netlify | Railway | AWS |
|---------|---------|---------|---------|-----|
| Static Pages | ✅ | ✅ | ✅ | ✅ |
| API Routes | ✅ | ⚠️ | ✅ | ✅ |
| Chat Assistant | ✅ | ⚠️ | ✅ | ✅ |
| Contact Form | ✅ | ⚠️ | ✅ | ✅ |
| Database Integration | ✅ | ⚠️ | ✅ | ✅ |
| Auto Deployments | ✅ | ✅ | ✅ | ⚠️ |
| Free Tier | ✅ | ✅ | ⚠️ | ❌ |

**Legend**: ✅ Full Support, ⚠️ Limited/Manual Setup Required, ❌ Not Available

---

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
- Ensure all environment variables are set
- Check Node.js version (requires 18+)
- Verify all dependencies are in package.json

**API Routes Not Working:**
- Confirm environment variables are properly set
- Check server logs for detailed error messages
- Verify API endpoints are accessible

**Database Connection Issues:**
- Test Supabase connection with `npm run test:supabase`
- Verify RLS policies are correctly configured
- Check network connectivity to Supabase

**Gmail Integration Not Working:**
- Verify OAuth2 credentials are valid
- Ensure refresh token hasn't expired
- Check Gmail API quotas and limits

### Platform-Specific Issues

**Vercel:**
- Function timeout (default 10s) - upgrade plan if needed
- Cold starts for infrequently used functions

**Netlify:**
- API routes may need manual function configuration
- Limited serverless function execution time

**Railway:**
- Resource limits on free tier
- Database connection limits

---

## 📊 Performance Optimization

### Build Optimization
- Enable build caching where available
- Use environment-specific builds
- Optimize images and assets

### Runtime Optimization  
- Configure CDN settings
- Enable compression
- Set up proper caching headers
- Monitor performance metrics

---

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific secret management
- Rotate API keys regularly
- Limit API key permissions

### Database Security
- Enable Row Level Security (RLS) in Supabase
- Use service role key only on server-side
- Regularly audit database access logs

### Gmail API Security
- Use OAuth2 with minimal required scopes
- Monitor API usage and quotas
- Implement rate limiting for email sending

---

## ✅ Recommended Platform Summary

**For most users**: **Vercel** is the best choice
- ✅ Zero configuration needed
- ✅ Excellent Next.js integration  
- ✅ Generous free tier
- ✅ Automatic deployments
- ✅ Global CDN included
- ✅ Perfect for all portfolio features

**For enterprise**: **AWS** with provided templates
- ✅ Full control over infrastructure
- ✅ Scalable for high traffic
- ✅ Enterprise security features
- ✅ Custom domain and SSL management

**For learning**: **Railway** 
- ✅ Good for understanding full-stack deployment
- ✅ Built-in database options
- ✅ Container-based deployment

---

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Test locally first with `npm run build && npm run start`
4. Check environment variables are correctly set
5. Review server logs for detailed error messages

For additional help:
- Open an issue on GitHub
- Contact through the portfolio website
- Email: steve-d-pennington@gmail.com

---

*Last updated: December 2024*
