# Cloud Deployment Guide - Pennington Portfolio

This guide covers deploying your Next.js portfolio application to Google Cloud Run with Gmail API and Supabase integration.

## Prerequisites

Before deploying, ensure you have:

- [ ] Google Cloud account with billing enabled
- [ ] Docker Desktop installed
- [ ] Google Cloud CLI installed
- [ ] Gmail API OAuth2 credentials configured
- [ ] Supabase project and database set up

## Quick Start

### 1. Install Required Tools

#### Google Cloud CLI
```bash
# Download from: https://cloud.google.com/sdk/docs/install
# After installation, authenticate:
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

### 2. Configure Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable required APIs:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

### 3. Set Up Environment Variables

Update the deployment script with your project details:

**For PowerShell (Windows):**
Edit `deploy.ps1` and replace:
```powershell
$PROJECT_ID = "your-actual-project-id"
```

**For Bash (Linux/Mac):**
Edit `deploy.sh` and replace:
```bash
PROJECT_ID="your-actual-project-id"
```

### 4. Deploy to Google Cloud Run

#### Option A: Using PowerShell (Windows)
```powershell
.\deploy.ps1
```

#### Option B: Using Bash (Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option C: Manual Deployment
```bash
# Build the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/pennington-portfolio .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/pennington-portfolio

# Deploy to Cloud Run
gcloud run deploy pennington-portfolio \
  --image gcr.io/YOUR_PROJECT_ID/pennington-portfolio \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "OAUTH_USER=your-email@gmail.com,OAUTH_CLIENT_ID=your-client-id,OAUTH_CLIENT_SECRET=your-client-secret,OAUTH_REFRESH_TOKEN=your-refresh-token,NEXT_PUBLIC_SUPABASE_URL=your-supabase-url,NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key"
```

## Environment Variables Configuration

The following environment variables are required for deployment:

### Gmail API Configuration
```bash
OAUTH_USER=steve-d-pennington@gmail.com
OAUTH_CLIENT_ID=your-google-oauth-client-id
OAUTH_CLIENT_SECRET=your-google-oauth-client-secret
OAUTH_REFRESH_TOKEN=your-oauth-refresh-token
```

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User visits   │    │  Google Cloud   │    │   Contact Form  │
│   Portfolio     │───▶│      Run        │───▶│   Submission    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                               ┌─────────────────┐    ┌─────────────────┐
                               │   Gmail API     │    │    Supabase     │
                               │ (Email Notify)  │◀───│   (Database)    │
                               └─────────────────┘    └─────────────────┘
```

## Features

### 🚀 **Deployment Features**
- **Container-based deployment** with Docker
- **Automatic scaling** with Google Cloud Run
- **HTTPS/SSL** automatically provided
- **Global CDN** for static assets
- **Environment variable management**

### 📧 **Gmail Integration**
- **OAuth2 authentication** for secure email sending
- **Direct Gmail API integration** (no SMTP issues)
- **Rich HTML email formatting**
- **Reply-to functionality** for easy responses

### 🗄️ **Database Integration**
- **Supabase PostgreSQL** for contact form storage
- **Real-time data synchronization**
- **Row Level Security (RLS)** for data protection
- **Admin dashboard** for viewing submissions

## Monitoring and Maintenance

### View Logs
```bash
gcloud logs tail --service=pennington-portfolio
```

### Update Deployment
```bash
# Rebuild and redeploy
docker build -t gcr.io/YOUR_PROJECT_ID/pennington-portfolio .
docker push gcr.io/YOUR_PROJECT_ID/pennington-portfolio
gcloud run services replace service.yaml
```

### Scale Configuration
```bash
# Update scaling settings
gcloud run services update pennington-portfolio \
  --min-instances=0 \
  --max-instances=10 \
  --concurrency=100
```

## Troubleshooting

### Common Issues

#### 1. Gmail API "unauthorized_client" error
- Ensure Gmail API is enabled in Google Cloud Console
- Verify OAuth2 redirect URI includes `https://developers.google.com/oauthplayground`
- Regenerate refresh token if expired

#### 2. Supabase connection issues
- Check environment variables are correctly set
- Verify Supabase project URL and API key
- Ensure `contact_requests` table exists with proper schema

#### 3. Docker build failures
- Ensure all dependencies are in `package.json`
- Check `.dockerignore` excludes unnecessary files
- Verify Node.js version compatibility

#### 4. Cloud Run deployment issues
- Check that all required APIs are enabled
- Verify billing is enabled on Google Cloud project
- Ensure Docker image was pushed successfully

### Debug Commands

```bash
# Test local Docker build
docker build -t test-portfolio .
docker run -p 3000:3000 test-portfolio

# Check Cloud Run service status
gcloud run services describe pennington-portfolio --region=us-central1

# View deployment history
gcloud run revisions list --service=pennington-portfolio
```

## Security Considerations

### ⚠️ **Important Security Notes**

1. **Never commit `.env.local`** to version control
2. **Use Google Secret Manager** for production secrets
3. **Enable Cloud Run IAM** for service-to-service authentication
4. **Regularly rotate OAuth2 tokens**
5. **Monitor Cloud Run logs** for suspicious activity

### Recommended Security Setup

```bash
# Store secrets in Google Secret Manager
gcloud secrets create gmail-oauth-secret --data-file=.env.local

# Update Cloud Run to use secrets
gcloud run services update pennington-portfolio \
  --update-secrets=OAUTH_CLIENT_SECRET=gmail-oauth-secret:latest
```

## Cost Optimization

- **Cloud Run** charges only for actual usage
- **Free tier** includes 2 million requests/month
- **Automatic scaling to zero** when not in use
- **Expected monthly cost**: $0-10 for typical portfolio traffic

## Support

For deployment issues:
- Check [Google Cloud Run documentation](https://cloud.google.com/run/docs)
- Review [Next.js deployment guide](https://nextjs.org/docs/deployment)
- Check application logs in Google Cloud Console

---

**Last Updated**: January 2025  
**Version**: 1.0.0
