#!/bin/bash

# Backup current R2 version before uploading new one
#
# This script downloads the current installer from R2 and saves it locally
# before uploading a new version, creating a safety net for rollbacks.
#
# Prerequisites:
# - AWS CLI configured with R2 credentials (see R2-UPLOAD-GUIDE.md)
# - upload-to-r2.sh configured and working
#
# Usage:
#   ./backup-before-upload.sh /path/to/new-SDIWare-Installer.exe

# Configuration
R2_ENDPOINT="https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com"
R2_BUCKET="sdiware"
R2_FILE_KEY="SDIWare-Installer.exe"
BACKUP_DIR="$HOME/sdiware-backups"
AWS_PROFILE="r2"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if new file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No file path provided${NC}"
    echo "Usage: $0 /path/to/new-SDIWare-Installer.exe"
    exit 1
fi

NEW_FILE="$1"

# Check if new file exists
if [ ! -f "$NEW_FILE" ]; then
    echo -e "${RED}Error: File not found: $NEW_FILE${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/SDIWare-Installer-$TIMESTAMP.exe"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SDIWare Backup & Upload${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Download current version from R2
echo -e "${YELLOW}Step 1/2: Backing up current version from R2...${NC}"
echo "Downloading: $R2_FILE_KEY"
echo "Saving to: $BACKUP_FILE"
echo ""

aws s3 cp "s3://$R2_BUCKET/$R2_FILE_KEY" "$BACKUP_FILE" \
    --endpoint-url "$R2_ENDPOINT" \
    --profile "$AWS_PROFILE" \
    --no-progress

if [ $? -eq 0 ]; then
    # Get backup file size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup successful: $BACKUP_FILE ($BACKUP_SIZE)${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠ Warning: Could not download current version${NC}"
    echo "This might be the first upload, or R2 credentials need configuration."
    echo ""
    read -p "Continue with upload anyway? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Upload cancelled."
        exit 1
    fi
fi

# Step 2: Upload new version
echo -e "${YELLOW}Step 2/2: Uploading new version...${NC}"
NEW_SIZE=$(du -h "$NEW_FILE" | cut -f1)
echo "File: $NEW_FILE ($NEW_SIZE)"
echo ""

./upload-to-r2.sh "$NEW_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓ Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "New version uploaded successfully"
    if [ -f "$BACKUP_FILE" ]; then
        echo "Previous version backed up to: $BACKUP_FILE"
        echo ""
        echo "To rollback, run:"
        echo "  ./upload-to-r2.sh \"$BACKUP_FILE\""
    fi
    echo ""

    # List recent backups
    echo -e "${BLUE}Recent backups:${NC}"
    ls -lht "$BACKUP_DIR"/*.exe 2>/dev/null | head -5 | awk '{print "  " $9 " (" $5 ")"}'
    echo ""

    # Show backup directory size
    TOTAL_BACKUP_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.exe 2>/dev/null | wc -l | tr -d ' ')
    echo "Total backups: $BACKUP_COUNT files ($TOTAL_BACKUP_SIZE)"
    echo "Location: $BACKUP_DIR"

else
    echo ""
    echo -e "${RED}✗ Upload failed${NC}"
    if [ -f "$BACKUP_FILE" ]; then
        echo "Backup is still available at: $BACKUP_FILE"
    fi
    exit 1
fi
