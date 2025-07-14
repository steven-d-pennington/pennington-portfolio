#!/usr/bin/env pwsh

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "steven-pennington-portfolio",
    
    [Parameter(Mandatory=$false)]
    [switch]$SetupSecrets
)

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = $Reset
    )
    Write-Host "$Color$Message$Reset"
}

function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Main deployment script
Write-ColorOutput "Cloudflare Pages Deployment Script" $Blue
Write-ColorOutput "Environment: $Environment" $Yellow
Write-Host ""

# Check prerequisites
Write-ColorOutput "Checking prerequisites..." $Blue

if (-not (Test-Command "node")) {
    Write-ColorOutput "Node.js not found" $Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-ColorOutput "npm not found" $Red
    exit 1
}

Write-ColorOutput "Prerequisites check passed" $Green

# Install dependencies
Write-ColorOutput "Installing dependencies..." $Blue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Failed to install dependencies" $Red
    exit 1
}
Write-ColorOutput "Dependencies installed" $Green

# Build the project
Write-ColorOutput "Building project..." $Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Build failed" $Red
    exit 1
}
Write-ColorOutput "Build completed" $Green

# Create pages configuration
Write-ColorOutput "Creating Cloudflare Pages configuration..." $Blue

$pagesConfig = @"
# Cloudflare Pages configuration
# This file is used for deployment to Cloudflare Pages

[build]
command = "npm run build"
publish = ".next"

[build.environment]
NODE_VERSION = "18"

[[redirects]]
from = "/api/*"
to = "/api/:splat"
status = 200

[[headers]]
for = "/api/*"
[headers.values]
Access-Control-Allow-Origin = "*"
Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
Access-Control-Allow-Headers = "Content-Type, Authorization"
"@

Set-Content "_pages.toml" $pagesConfig
Write-ColorOutput "Pages configuration created" $Green

# Instructions for manual deployment
Write-ColorOutput "Deployment Instructions:" $Blue
Write-ColorOutput "Since Cloudflare Pages requires manual setup through the dashboard, follow these steps:" $Yellow
Write-Host ""

Write-ColorOutput "1. Go to Cloudflare Pages Dashboard:" $Blue
Write-ColorOutput "   https://dash.cloudflare.com/pages" $Yellow
Write-Host ""

Write-ColorOutput "2. Click 'Create a project' > 'Connect to Git'" $Blue
Write-Host ""

Write-ColorOutput "3. Select your GitHub repository" $Blue
Write-Host ""

Write-ColorOutput "4. Configure build settings:" $Blue
Write-ColorOutput "   - Project name: $ProjectName" $Yellow
Write-ColorOutput "   - Production branch: main" $Yellow
Write-ColorOutput "   - Framework preset: Next.js" $Yellow
Write-ColorOutput "   - Build command: npm run build" $Yellow
Write-ColorOutput "   - Build output directory: .next" $Yellow
Write-Host ""

Write-ColorOutput "5. Add environment variables:" $Blue
Write-ColorOutput "   - NEXT_PUBLIC_SUPABASE_URL" $Yellow
Write-ColorOutput "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" $Yellow
Write-ColorOutput "   - OAUTH_USER" $Yellow
Write-ColorOutput "   - OAUTH_CLIENT_ID" $Yellow
Write-ColorOutput "   - OAUTH_CLIENT_SECRET" $Yellow
Write-ColorOutput "   - OAUTH_REFRESH_TOKEN" $Yellow
Write-Host ""

Write-ColorOutput "6. Click 'Save and Deploy'" $Blue
Write-Host ""

Write-ColorOutput "7. Set up custom domain (optional):" $Blue
Write-ColorOutput "   - Go to Custom domains tab" $Yellow
Write-ColorOutput "   - Add: portfolio.stevenpennington.com" $Yellow
Write-Host ""

Write-ColorOutput "Your site will be available at:" $Green
Write-ColorOutput "https://$ProjectName.pages.dev" $Yellow
Write-Host ""

Write-ColorOutput "Deployment script completed! Follow the manual steps above." $Green 