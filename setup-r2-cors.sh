#!/bin/bash

# Setup CORS for R2 bucket to allow browser uploads
# Run this script to configure CORS on your R2 bucket

set -e

echo "=================================================="
echo "🔧 SDIWare R2 CORS Configuration"
echo "=================================================="
echo ""

# Load R2 config
if [ ! -f .r2-config ]; then
    echo "❌ Error: .r2-config file not found"
    echo "Please run ./setup-r2-config.sh first"
    exit 1
fi

source .r2-config

echo "Bucket: $R2_BUCKET"
echo "Endpoint: $R2_ENDPOINT"
echo ""

# Create CORS configuration file
CORS_CONFIG=$(cat <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF
)

echo "CORS Configuration:"
echo "$CORS_CONFIG"
echo ""

# Save to temporary file
echo "$CORS_CONFIG" > /tmp/r2-cors.json

echo "Applying CORS configuration to R2 bucket..."
echo ""

# Apply CORS configuration
aws s3api put-bucket-cors \
    --bucket "$R2_BUCKET" \
    --cors-configuration file:///tmp/r2-cors.json \
    --endpoint-url "$R2_ENDPOINT" \
    --profile "$AWS_PROFILE"

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration applied successfully!"
    echo ""
    echo "Your R2 bucket now allows browser uploads from any origin."
    echo "You can now upload files directly from https://sdiware.video"
else
    echo "❌ Failed to apply CORS configuration"
    exit 1
fi

# Clean up
rm /tmp/r2-cors.json

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Try uploading from https://sdiware.video/admin-upload.html"
echo "2. The upload should now work without CORS errors"
echo ""
