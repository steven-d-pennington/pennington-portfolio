#!/bin/bash

# Google Cloud deployment script for Pennington Portfolio
# Make sure you have Google Cloud CLI installed and authenticated

# Configuration
PROJECT_ID="your-project-id"  # Replace with your Google Cloud Project ID
SERVICE_NAME="pennington-portfolio"
REGION="us-central1"  # Change if you prefer a different region
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying Pennington Portfolio to Google Cloud Run..."

# Build and push the Docker image
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME .

echo "🔄 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "OAUTH_USER=$OAUTH_USER,OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID,OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET,OAUTH_REFRESH_TOKEN=$OAUTH_REFRESH_TOKEN,NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🌐 Your portfolio should be available at the URL shown above."
