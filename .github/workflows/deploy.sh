#!/bin/bash

echo "🚀 Deploying ContractHub to AWS..."

# Build the app
echo "📦 Building application..."
npm run build

# Upload to S3
echo "☁️ Uploading to S3..."
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront (if you have it)
echo "🌐 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "✅ Deployment complete!"
