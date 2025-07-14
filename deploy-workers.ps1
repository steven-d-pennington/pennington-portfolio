#!/usr/bin/env pwsh

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("development", "staging", "production")]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [string]$ZoneId = "",
    
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

function Test-WranglerAuth {
    try {
        $result = wrangler whoami 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
        return $false
    }
    catch {
        return $false
    }
}

# Main deployment script
Write-ColorOutput "Cloudflare Workers Deployment Script" $Blue
Write-ColorOutput "Environment: $Environment" $Yellow
Write-Host ""

# Check prerequisites
Write-ColorOutput "Checking prerequisites..." $Blue

if (-not (Test-Command "wrangler")) {
    Write-ColorOutput "Wrangler CLI not found. Installing..." $Red
    npm install -g wrangler
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "Failed to install Wrangler CLI" $Red
        exit 1
    }
}

if (-not (Test-Command "node")) {
    Write-ColorOutput "Node.js not found" $Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-ColorOutput "npm not found" $Red
    exit 1
}

Write-ColorOutput "Prerequisites check passed" $Green

# Check authentication
Write-ColorOutput "Checking Cloudflare authentication..." $Blue
if (-not (Test-WranglerAuth)) {
    Write-ColorOutput "Not authenticated with Cloudflare. Please run: wrangler login" $Red
    exit 1
}

Write-ColorOutput "Authentication check passed" $Green

# Install dependencies
Write-ColorOutput "Installing dependencies..." $Blue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Failed to install dependencies" $Red
    exit 1
}
Write-ColorOutput "Dependencies installed" $Green

# Build the project for Cloudflare Workers
Write-ColorOutput "Building project for Cloudflare Workers..." $Blue
npx @cloudflare/next-on-pages
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Build failed" $Red
    exit 1
}
Write-ColorOutput "Build completed" $Green

# Setup secrets if requested
if ($SetupSecrets) {
    Write-ColorOutput "Setting up secrets..." $Blue
    
    $secrets = @(
        "OAUTH_USER",
        "OAUTH_CLIENT_ID", 
        "OAUTH_CLIENT_SECRET",
        "OAUTH_REFRESH_TOKEN"
    )
    
    foreach ($secret in $secrets) {
        $value = Read-Host "Enter value for $secret" -AsSecureString
        $plainValue = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($value))
        
        Write-ColorOutput "Setting $secret..." $Yellow
        wrangler secret put $secret --env $Environment
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "Failed to set secret: $secret" $Red
        } else {
            Write-ColorOutput "Secret set: $secret" $Green
        }
    }
}

# Set public environment variables
Write-ColorOutput "Setting public environment variables..." $Blue

$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = $env:NEXT_PUBLIC_SUPABASE_URL
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
}

foreach ($key in $envVars.Keys) {
    if ($envVars[$key]) {
        Write-ColorOutput "Setting $key..." $Yellow
        wrangler var put $key $envVars[$key] --env $Environment
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Variable set: $key" $Green
        } else {
            Write-ColorOutput "Failed to set variable: $key" $Red
        }
    } else {
        Write-ColorOutput "Skipping $key (not set in environment)" $Yellow
    }
}

# Update zone_id if provided
if ($ZoneId) {
    Write-ColorOutput "Updating zone ID..." $Blue
    $wranglerContent = Get-Content "wrangler.toml" -Raw
    $wranglerContent = $wranglerContent -replace "zone_id = `"your-zone-id-here`"", "zone_id = `"$ZoneId`""
    Set-Content "wrangler.toml" $wranglerContent
    Write-ColorOutput "Zone ID updated" $Green
}

# Deploy to Cloudflare Workers
Write-ColorOutput "Deploying to Cloudflare Workers ($Environment)..." $Blue
wrangler deploy --env $Environment
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Deployment failed" $Red
    exit 1
}

Write-ColorOutput "Deployment completed successfully!" $Green

# Show deployment info
Write-ColorOutput "Deployment Information:" $Blue
Write-ColorOutput "Environment: $Environment" $Yellow
Write-ColorOutput "Worker Name: steven-pennington-portfolio" $Yellow

if ($Environment -eq "production") {
    Write-ColorOutput "Production URL: https://portfolio.stevenpennington.com" $Green
} elseif ($Environment -eq "staging") {
    Write-ColorOutput "Staging URL: https://staging.portfolio.stevenpennington.com" $Green
} else {
    Write-ColorOutput "Development URL: https://dev.portfolio.stevenpennington.com" $Green
}

Write-ColorOutput "To view logs: wrangler tail --env $Environment" $Blue
Write-ColorOutput "To update secrets: wrangler secret put SECRET_NAME --env $Environment" $Blue

Write-Host ""
Write-ColorOutput "Deployment script completed!" $Green 