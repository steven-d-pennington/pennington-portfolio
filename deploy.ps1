# Google Cloud deployment script for Pennington Portfolio (PowerShell)
# Make sure you have Google Cloud CLI installed and authenticated

# Configuration
$PROJECT_ID = "your-project-id"  # Replace with your Google Cloud Project ID
$SERVICE_NAME = "pennington-portfolio"
$REGION = "us-central1"  # Change if you prefer a different region
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "🚀 Deploying Pennington Portfolio to Google Cloud Run..." -ForegroundColor Green

# Build and push the Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t $IMAGE_NAME .

Write-Host "🔄 Pushing image to Google Container Registry..." -ForegroundColor Yellow
docker push $IMAGE_NAME

Write-Host "☁️ Deploying to Cloud Run..." -ForegroundColor Yellow

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars "OAUTH_USER=$env:OAUTH_USER,OAUTH_CLIENT_ID=$env:OAUTH_CLIENT_ID,OAUTH_CLIENT_SECRET=$env:OAUTH_CLIENT_SECRET,OAUTH_REFRESH_TOKEN=$env:OAUTH_REFRESH_TOKEN,NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY" `
  --memory 512Mi `
  --cpu 1 `
  --max-instances 10

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your portfolio should be available at the URL shown above." -ForegroundColor Cyan
