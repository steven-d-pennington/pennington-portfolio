# Cloudflare Workers Setup Guide

## Quick Start

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Get Your Zone ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain
3. Copy the Zone ID from the right sidebar
4. Update `wrangler.toml` with your Zone ID

### 4. Set Environment Variables
```bash
# Set public variables
wrangler var put NEXT_PUBLIC_SUPABASE_URL "your-supabase-url" --env production
wrangler var put NEXT_PUBLIC_SUPABASE_ANON_KEY "your-supabase-key" --env production

# Set secrets (encrypted)
wrangler secret put OAUTH_USER --env production
wrangler secret put OAUTH_CLIENT_ID --env production
wrangler secret put OAUTH_CLIENT_SECRET --env production
wrangler secret put OAUTH_REFRESH_TOKEN --env production
```

### 5. Deploy

#### Using PowerShell (Windows)
```powershell
.\deploy-workers.ps1 -Environment production -ZoneId "your-zone-id"
```

#### Using Bash (Linux/macOS)
```bash
./deploy-workers.sh production "your-zone-id"
```

#### Manual Deployment
```bash
wrangler deploy --env production
```

## Environment Setup

### Production Environment
- **URL**: `https://portfolio.stevenpennington.com`
- **Worker Name**: `steven-pennington-portfolio`

### Staging Environment
- **URL**: `https://staging.portfolio.stevenpennington.com`
- **Worker Name**: `steven-pennington-portfolio-staging`

### Development Environment
- **URL**: `https://dev.portfolio.stevenpennington.com`
- **Worker Name**: `steven-pennington-portfolio-dev`

## Configuration Files

### wrangler.toml
The main configuration file for Cloudflare Workers deployment.

### Key Settings:
- `compatibility_flags = ["nodejs_compat"]` - Enables Node.js compatibility
- `route` - Defines the domain routing
- `zone_id` - Your Cloudflare zone ID

## Environment Variables

### Public Variables (Set via `wrangler var put`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Secrets (Set via `wrangler secret put`)
- `OAUTH_USER`
- `OAUTH_CLIENT_ID`
- `OAUTH_CLIENT_SECRET`
- `OAUTH_REFRESH_TOKEN`

## Useful Commands

### View Logs
```bash
wrangler tail --env production
```

### Update Secrets
```bash
wrangler secret put SECRET_NAME --env production
```

### Update Variables
```bash
wrangler var put VARIABLE_NAME "value" --env production
```

### Local Development
```bash
wrangler dev --env development
```

## Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   wrangler login
   ```

2. **Zone ID Not Found**
   - Check your domain is added to Cloudflare
   - Verify Zone ID in Cloudflare dashboard

3. **Build Failures**
   ```bash
   npm install
   npm run build
   ```

4. **Environment Variables Not Set**
   ```bash
   wrangler var list --env production
   wrangler secret list --env production
   ```

## Cost Information

- **Free Tier**: 100,000 requests/day, 10ms CPU time
- **Paid**: $5/month for 10 million requests + additional CPU time

## Performance Benefits

- **Global Edge Network**: <10ms latency worldwide
- **Automatic Scaling**: Handles traffic spikes automatically
- **Built-in Security**: DDoS protection and WAF included
- **Zero Cold Starts**: Always warm and ready to serve

## Next Steps

1. Set up custom domain in Cloudflare
2. Configure SSL certificates (automatic)
3. Set up monitoring and analytics
4. Configure caching strategies
5. Set up CI/CD pipeline 