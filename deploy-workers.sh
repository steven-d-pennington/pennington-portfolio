#!/bin/bash

# Cloudflare Workers Deployment Script
# Usage: ./deploy-workers.sh [environment] [zone-id] [--setup-secrets]

set -e

# Default values
ENVIRONMENT=${1:-"production"}
ZONE_ID=${2:-""}
SETUP_SECRETS=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --setup-secrets)
            SETUP_SECRETS=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}$1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check wrangler authentication
check_wrangler_auth() {
    if wrangler whoami >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Main deployment script
echo -e "${BLUE}🚀 Cloudflare Workers Deployment Script${NC}"
print_info "Environment: $ENVIRONMENT"
echo ""

# Check prerequisites
print_status "📋 Checking prerequisites..."

if ! command_exists wrangler; then
    print_error "Wrangler CLI not found. Installing..."
    npm install -g wrangler
    if [ $? -ne 0 ]; then
        print_error "Failed to install Wrangler CLI"
        exit 1
    fi
fi

if ! command_exists node; then
    print_error "Node.js not found"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm not found"
    exit 1
fi

print_success "Prerequisites check passed"

# Check authentication
print_status "🔐 Checking Cloudflare authentication..."
if ! check_wrangler_auth; then
    print_error "Not authenticated with Cloudflare. Please run: wrangler login"
    exit 1
fi

print_success "Authentication check passed"

# Install dependencies
print_status "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed"

# Build the project
print_status "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Build completed"

# Setup secrets if requested
if [ "$SETUP_SECRETS" = true ]; then
    print_status "🔒 Setting up secrets..."
    
    secrets=("OAUTH_USER" "OAUTH_CLIENT_ID" "OAUTH_CLIENT_SECRET" "OAUTH_REFRESH_TOKEN")
    
    for secret in "${secrets[@]}"; do
        echo -n "Enter value for $secret: "
        read -s value
        echo ""
        
        print_info "Setting $secret..."
        echo "$value" | wrangler secret put "$secret" --env "$ENVIRONMENT"
        if [ $? -eq 0 ]; then
            print_success "Secret set: $secret"
        else
            print_error "Failed to set secret: $secret"
        fi
    done
fi

# Set public environment variables
print_status "🌍 Setting public environment variables..."

env_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")

for var in "${env_vars[@]}"; do
    value="${!var}"
    if [ -n "$value" ]; then
        print_info "Setting $var..."
        wrangler var put "$var" "$value" --env "$ENVIRONMENT"
        if [ $? -eq 0 ]; then
            print_success "Variable set: $var"
        else
            print_error "Failed to set variable: $var"
        fi
    else
        print_warning "Skipping $var (not set in environment)"
    fi
done

# Update zone_id if provided
if [ -n "$ZONE_ID" ]; then
    print_status "🌐 Updating zone ID..."
    sed -i "s/zone_id = \"your-zone-id-here\"/zone_id = \"$ZONE_ID\"/g" wrangler.toml
    print_success "Zone ID updated"
fi

# Deploy to Cloudflare Workers
print_status "🚀 Deploying to Cloudflare Workers ($ENVIRONMENT)..."
wrangler deploy --env "$ENVIRONMENT"
if [ $? -ne 0 ]; then
    print_error "Deployment failed"
    exit 1
fi

print_success "Deployment completed successfully!"

# Show deployment info
print_status "📊 Deployment Information:"
print_info "Environment: $ENVIRONMENT"
print_info "Worker Name: steven-pennington-portfolio"

case $ENVIRONMENT in
    "production")
        print_success "Production URL: https://portfolio.stevenpennington.com"
        ;;
    "staging")
        print_success "Staging URL: https://staging.portfolio.stevenpennington.com"
        ;;
    "development")
        print_success "Development URL: https://dev.portfolio.stevenpennington.com"
        ;;
esac

print_status "📝 To view logs: wrangler tail --env $ENVIRONMENT"
print_status "🔧 To update secrets: wrangler secret put SECRET_NAME --env $ENVIRONMENT"

echo ""
print_success "🎉 Deployment script completed!" 