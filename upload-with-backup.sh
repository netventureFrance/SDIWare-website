#!/bin/bash

# Upload SDIWare installer with automatic backup
#
# This is the recommended way to upload new versions.
# It automatically:
# 1. Downloads current version from R2 (backup)
# 2. Uploads new version to R2
# 3. Keeps local backup for rollback
#
# Usage:
#   ./upload-with-backup.sh /path/to/SDIWare-Installer.exe

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load configuration
CONFIG_FILE=".r2-config"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: R2 not configured${NC}"
    echo ""
    echo "Please run the setup script first:"
    echo "  ./setup-r2-config.sh"
    echo ""
    exit 1
fi

source "$CONFIG_FILE"

# Check if file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No file path provided${NC}"
    echo ""
    echo "Usage: $0 /path/to/SDIWare-Installer.exe"
    echo ""
    echo "This script will:"
    echo "  1. Backup current version from R2"
    echo "  2. Upload your new version"
    echo "  3. Keep local backup for rollback"
    exit 1
fi

NEW_FILE="$1"

# Validate file
if [ ! -f "$NEW_FILE" ]; then
    echo -e "${RED}Error: File not found: $NEW_FILE${NC}"
    exit 1
fi

if [[ ! "$NEW_FILE" =~ \.exe$ ]]; then
    echo -e "${YELLOW}Warning: File doesn't have .exe extension${NC}"
    read -p "Continue anyway? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Upload cancelled."
        exit 1
    fi
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/SDIWare-Installer-$TIMESTAMP.exe"

# Display banner
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SDIWare Upload with Automatic Backup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Backup current version
echo -e "${YELLOW}[1/2] Backing up current version from R2...${NC}"
echo "      Downloading: $R2_FILE_KEY"
echo "      Saving to: $BACKUP_FILE"
echo ""

aws s3 cp "s3://$R2_BUCKET/$R2_FILE_KEY" "$BACKUP_FILE" \
    --endpoint-url "$R2_ENDPOINT" \
    --profile "$AWS_PROFILE" \
    --no-progress 2>/dev/null

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "      ${GREEN}✓ Backup saved: $BACKUP_FILE ($BACKUP_SIZE)${NC}"
else
    echo -e "      ${YELLOW}⚠ No existing file to backup (this might be the first upload)${NC}"
fi

echo ""

# Step 2: Upload new version
echo -e "${YELLOW}[2/2] Uploading new version to R2...${NC}"
NEW_SIZE=$(du -h "$NEW_FILE" | cut -f1)
echo "      File: $NEW_FILE ($NEW_SIZE)"
echo "      Destination: s3://$R2_BUCKET/$R2_FILE_KEY"
echo ""

aws s3 cp "$NEW_FILE" "s3://$R2_BUCKET/$R2_FILE_KEY" \
    --endpoint-url "$R2_ENDPOINT" \
    --profile "$AWS_PROFILE" \
    --content-type "application/x-msdownload"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "      ${GREEN}✓ Upload successful!${NC}"
else
    echo ""
    echo -e "${RED}✗ Upload failed${NC}"
    if [ -f "$BACKUP_FILE" ]; then
        echo "Backup is available at: $BACKUP_FILE"
    fi
    exit 1
fi

# Success summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✓ Upload Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "New version is now live at: https://sdiware.video"

if [ -f "$BACKUP_FILE" ]; then
    echo ""
    echo -e "${BLUE}Backup Information:${NC}"
    echo "  Previous version saved to: $BACKUP_FILE"
    echo ""
    echo "  To rollback to this version, run:"
    echo "    ./upload-with-backup.sh \"$BACKUP_FILE\""
fi

# Show recent backups
echo ""
echo -e "${BLUE}Recent Backups:${NC}"
if ls "$BACKUP_DIR"/*.exe 1> /dev/null 2>&1; then
    ls -lht "$BACKUP_DIR"/*.exe 2>/dev/null | head -5 | while read -r line; do
        FILE=$(echo "$line" | awk '{print $9}')
        SIZE=$(echo "$line" | awk '{print $5}')
        DATE=$(echo "$line" | awk '{print $6, $7, $8}')
        BASENAME=$(basename "$FILE")
        echo "  - $BASENAME ($DATE, $SIZE)"
    done

    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.exe 2>/dev/null | wc -l | tr -d ' ')
    TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    echo ""
    echo "  Total: $BACKUP_COUNT backups ($TOTAL_SIZE)"
    echo "  Location: $BACKUP_DIR"

    # Suggest cleanup if many backups
    if [ "$BACKUP_COUNT" -gt 10 ]; then
        echo ""
        echo -e "${YELLOW}  Tip: You have $BACKUP_COUNT backups. Consider cleaning up old ones:${NC}"
        echo "    ./cleanup-old-backups.sh 90  # Keep last 90 days"
    fi
else
    echo "  (No backups yet)"
fi

echo ""
