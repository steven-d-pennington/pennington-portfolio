# Multi-Cloud Deployment Guide

## Overview

This guide provides comprehensive deployment instructions for Steven Pennington's portfolio website across three major cloud platforms:

1. **Cloudflare Pages** - Recommended for static sites with API routes
2. **AWS ECS Fargate** - Containerized deployment with auto-scaling
3. **Google Cloud Run** - Serverless container platform

## Platform Comparison

| Feature | Cloudflare Pages | AWS ECS Fargate | Google Cloud Run |
|---------|------------------|-----------------|------------------|
| **Best For** | Static sites, edge functions | Production workloads, auto-scaling | Serverless containers |
| **Cost** | Free tier generous | Pay per use | Pay per request |
| **Performance** | Global CDN, edge computing | High performance, dedicated resources | Fast cold starts |
| **Scaling** | Automatic | Auto-scaling policies | Automatic |
| **Complexity** | Low | Medium | Low |
| **Management** | Minimal | Full control | Managed |

## Prerequisites

### Common Requirements
- **Git Repository**: Code must be in a Git repository (GitHub recommended)
- **Environment Variables**: Supabase and Gmail OAuth credentials
- **Domain Name**: Custom domain for production (optional but recommended)

### Platform-Specific Requirements

#### Cloudflare Pages
- Cloudflare account
- GitHub repository connected

#### AWS ECS Fargate
- AWS account with appropriate permissions
- AWS CLI installed and configured
- Docker installed and running
- Domain with SSL certificate (optional)

#### Google Cloud Run
- Google Cloud account
- Google Cloud CLI installed and authenticated
- Docker installed and running

## Environment Variables Setup

### Required Variables
All platforms require these environment variables:

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

---

## 1. Cloudflare Pages Deployment

### Quick Start (Recommended)

1. **Connect Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project" → "Connect to Git"
   - Select your GitHub repository

2. **Configure Build Settings**
   - **Project name**: `steven-pennington-portfolio`
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`

3. **Environment Variables**
   - Go to Settings → Environment variables
   - Add all required environment variables
   - Set for both "Production" and "Preview"

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for build completion (2-3 minutes)

### Advanced Configuration

#### Custom Domain Setup
1. Go to your Pages project dashboard
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `portfolio.stevenpennington.com`)

#### Performance Optimization
- Enable "Auto Minify" for JavaScript, CSS, and HTML
- Enable "Brotli" compression
- Configure appropriate cache headers

### Monitoring
- Built-in analytics in Pages dashboard
- Real-time visitor data and performance metrics
- Function logs for API routes

---

## 2. AWS ECS Fargate Deployment

### Quick Start

1. **Prerequisites Check**
   ```bash
   # Verify AWS CLI
   aws --version
   aws sts get-caller-identity
   
   # Verify Docker
   docker --version
   docker info
   ```

2. **Deploy Infrastructure**
   ```bash
   # Make script executable
   chmod +x aws/deploy.sh
   
   # Deploy to production
   ./aws/deploy.sh production us-east-1
   
   # Deploy with custom domain and SSL
   ./aws/deploy.sh production us-east-1 portfolio.stevenpennington.com arn:aws:acm:us-east-1:123456789012:certificate/xxx
   ```

### PowerShell Deployment (Windows)

```powershell
# Deploy to production
.\aws\deploy.ps1 -Environment production -Region us-east-1

# Deploy with custom domain
.\aws\deploy.ps1 -Environment production -Region us-east-1 -DomainName portfolio.stevenpennington.com
```

### Manual Deployment Steps

1. **Deploy VPC Stack**
   ```bash
   aws cloudformation deploy \
     --template-file aws/cloudformation/vpc.yaml \
     --stack-name pennington-portfolio-vpc-production \
     --parameter-overrides Environment=production \
     --capabilities CAPABILITY_IAM \
     --region us-east-1
   ```

2. **Deploy ECR Stack**
   ```bash
   aws cloudformation deploy \
     --template-file aws/cloudformation/ecr.yaml \
     --stack-name pennington-portfolio-ecr-production \
     --parameter-overrides Environment=production \
     --capabilities CAPABILITY_IAM \
     --region us-east-1
   ```

3. **Build and Push Docker Image**
   ```bash
   # Get ECR repository URI
   ECR_REPO_URI=$(aws cloudformation describe-stacks \
     --stack-name pennington-portfolio-ecr-production \
     --region us-east-1 \
     --query 'Stacks[0].Outputs[?OutputKey==`RepositoryUri`].OutputValue' \
     --output text)
   
   # Build and push
   docker build -t pennington-portfolio .
   docker tag pennington-portfolio:latest $ECR_REPO_URI:latest
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REPO_URI
   docker push $ECR_REPO_URI:latest
   ```

4. **Deploy Application Stack**
   ```bash
   aws cloudformation deploy \
     --template-file aws/cloudformation/main.yaml \
     --stack-name pennington-portfolio-production \
     --parameter-overrides \
       Environment=production \
       DomainName=portfolio.stevenpennington.com \
       CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/xxx \
       VpcId=vpc-12345678 \
       PublicSubnets="subnet-12345678 subnet-87654321" \
       PrivateSubnets="subnet-11111111 subnet-22222222" \
     --capabilities CAPABILITY_IAM \
     --region us-east-1
   ```

### Infrastructure Components

The AWS deployment creates:
- **VPC** with public and private subnets across 2 AZs
- **ECS Cluster** with Fargate capacity providers
- **Application Load Balancer** with health checks
- **ECR Repository** for Docker images
- **Auto Scaling** policies for CPU and memory
- **CloudWatch Logs** for monitoring
- **IAM Roles** for ECS tasks

### Monitoring and Scaling

- **Auto Scaling**: CPU > 70% or Memory > 80% triggers scaling
- **Health Checks**: ALB checks `/api/health` endpoint
- **Logs**: CloudWatch logs with 30-day retention
- **Metrics**: CPU, memory, request count, response time

---

## 3. Google Cloud Run Deployment

### Quick Start

1. **Prerequisites Check**
   ```bash
   # Verify Google Cloud CLI
   gcloud --version
   gcloud auth list
   
   # Verify Docker
   docker --version
   docker info
   ```

2. **Deploy**
   ```bash
   # Make script executable
   chmod +x deploy.sh
   
   # Deploy to production
   ./deploy.sh
   ```

### PowerShell Deployment (Windows)

```powershell
# Deploy to production
.\deploy.ps1
```

### Manual Deployment Steps

1. **Set Project ID**
   ```bash
   export PROJECT_ID="your-project-id"
   export SERVICE_NAME="pennington-portfolio"
   export REGION="us-central1"
   export IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
   ```

2. **Build and Push Image**
   ```bash
   docker build -t $IMAGE_NAME .
   docker push $IMAGE_NAME
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy $SERVICE_NAME \
     --image $IMAGE_NAME \
     --platform managed \
     --region $REGION \
     --allow-unauthenticated \
     --set-env-vars "OAUTH_USER=$OAUTH_USER,OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID,OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET,OAUTH_REFRESH_TOKEN=$OAUTH_REFRESH_TOKEN,NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     --memory 512Mi \
     --cpu 1 \
     --max-instances 10
   ```

### Custom Domain Setup

1. **Map Custom Domain**
   ```bash
   gcloud run domain-mappings create \
     --service $SERVICE_NAME \
     --domain portfolio.stevenpennington.com \
     --region $REGION
   ```

2. **SSL Certificate**
   - Cloud Run automatically provisions SSL certificates
   - No additional configuration required

### Monitoring

- **Cloud Run Console**: Built-in metrics and logs
- **Cloud Monitoring**: Custom dashboards and alerts
- **Cloud Logging**: Structured logging and analysis

---

## Environment-Specific Configurations

### Development Environment

```bash
# Environment variables for development
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=your-dev-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-supabase-key
```

### Staging Environment

```bash
# Environment variables for staging
NODE_ENV=staging
NEXT_PUBLIC_SUPABASE_URL=your-staging-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-supabase-key
```

### Production Environment

```bash
# Environment variables for production
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your-prod-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-supabase-key
```

---

## Security Best Practices

### Environment Variables
- Never commit sensitive data to Git
- Use platform-specific secret management
- Rotate credentials regularly
- Use different credentials per environment

### Network Security
- **Cloudflare**: Built-in DDoS protection and WAF
- **AWS**: Security groups, VPC isolation, ALB security
- **Google Cloud**: VPC firewall rules, IAM policies

### Application Security
- Input validation on contact form
- Rate limiting for API endpoints
- HTTPS enforcement
- Content Security Policy headers

---

## Cost Optimization

### Cloudflare Pages
- **Free Tier**: 500 builds/month, 100GB bandwidth
- **Paid**: $20/month for additional builds and bandwidth

### AWS ECS Fargate
- **Compute**: ~$0.04 per vCPU hour, ~$0.004 per GB hour
- **ALB**: ~$16/month + data processing
- **CloudWatch**: First 5GB logs free, then $0.50/GB

### Google Cloud Run
- **Compute**: Pay per request + CPU/memory allocation
- **Free Tier**: 2 million requests/month
- **Paid**: ~$0.00002400 per 100ms of CPU allocation

---

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
npm run build

# Verify dependencies
npm install

# Check Node.js version
node --version
```

#### Environment Variables
```bash
# Verify environment variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $OAUTH_USER

# Test API endpoints locally
npm run dev
```

#### Docker Issues
```bash
# Check Docker daemon
docker info

# Verify image builds
docker build -t test-image .

# Test container locally
docker run -p 3000:3000 test-image
```

### Platform-Specific Issues

#### Cloudflare Pages
- Check build logs in Pages dashboard
- Verify redirects configuration
- Test API routes locally

#### AWS ECS Fargate
- Check ECS service events
- Verify target group health
- Review CloudWatch logs

#### Google Cloud Run
- Check Cloud Run logs
- Verify service configuration
- Test with curl locally

---

## Monitoring and Maintenance

### Health Checks
- **Endpoint**: `/api/health`
- **Expected Response**: `{"status": "healthy"}`
- **Frequency**: 30 seconds (AWS), automatic (Cloudflare/Google Cloud)

### Backup Strategy
- **Code**: Git repository with version control
- **Database**: Supabase automated backups
- **Configuration**: Environment variables documented

### Update Process
1. Update code in Git repository
2. Trigger deployment (automatic or manual)
3. Monitor deployment health
4. Verify functionality
5. Rollback if needed

---

## Support Resources

### Documentation
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)

### Community
- [Cloudflare Community](https://community.cloudflare.com/)
- [AWS Developer Forums](https://forums.aws.amazon.com/)
- [Google Cloud Community](https://cloud.google.com/community)

### Tools
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [AWS Console](https://console.aws.amazon.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## Next Steps

After successful deployment:
1. Test all functionality (contact form, navigation)
2. Set up monitoring and alerts
3. Configure custom domain and SSL
4. Set up CI/CD pipeline for automated deployments
5. Implement backup and disaster recovery procedures
6. Monitor performance and optimize as needed
