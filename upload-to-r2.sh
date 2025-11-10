#!/bin/bash

# Upload SDIWare-Installer.exe to Cloudflare R2
#
# Prerequisites:
# 1. Install AWS CLI: brew install awscli
# 2. Configure your R2 credentials (see below)
#
# Usage: ./upload-to-r2.sh /path/to/SDIWare-Installer.exe

# R2 Configuration
R2_ENDPOINT="https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com"
R2_BUCKET="sdiware"
R2_FILE_KEY="SDIWare-Installer.exe"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if file path is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No file path provided${NC}"
    echo "Usage: $0 /path/to/SDIWare-Installer.exe"
    exit 1
fi

FILE_PATH="$1"

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo -e "${RED}Error: File not found: $FILE_PATH${NC}"
    exit 1
fi

# Get file size for display
FILE_SIZE=$(du -h "$FILE_PATH" | cut -f1)

echo -e "${YELLOW}Preparing to upload to Cloudflare R2...${NC}"
echo "File: $FILE_PATH ($FILE_SIZE)"
echo "Bucket: $R2_BUCKET"
echo "Key: $R2_FILE_KEY"
echo ""

# Upload to R2 using AWS CLI
# Note: You need to have AWS CLI configured with R2 credentials
# Use profile name 'r2' (or change it below)
echo -e "${YELLOW}Uploading...${NC}"

aws s3 cp "$FILE_PATH" "s3://$R2_BUCKET/$R2_FILE_KEY" \
    --endpoint-url "$R2_ENDPOINT" \
    --profile r2

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Upload successful!${NC}"
    echo "The installer is now available at: $R2_BUCKET/$R2_FILE_KEY"
else
    echo ""
    echo -e "${RED}✗ Upload failed${NC}"
    echo "Please check your AWS CLI configuration and R2 credentials"
    exit 1
fi
