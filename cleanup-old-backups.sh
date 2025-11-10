#!/bin/bash

# Cleanup old local backups
#
# This script helps manage local backup storage by removing backups older
# than a specified number of days.
#
# Usage:
#   ./cleanup-old-backups.sh [days]
#
# Examples:
#   ./cleanup-old-backups.sh          # Interactive mode
#   ./cleanup-old-backups.sh 90       # Delete backups older than 90 days
#   ./cleanup-old-backups.sh 30       # Delete backups older than 30 days

BACKUP_DIR="$HOME/sdiware-backups"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SDIWare Backup Cleanup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}No backup directory found at: $BACKUP_DIR${NC}"
    exit 0
fi

# Count total backups
TOTAL_BACKUPS=$(ls -1 "$BACKUP_DIR"/*.exe 2>/dev/null | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

echo "Backup directory: $BACKUP_DIR"
echo "Total backups: $TOTAL_BACKUPS files ($TOTAL_SIZE)"
echo ""

if [ "$TOTAL_BACKUPS" -eq 0 ]; then
    echo "No backups to clean up."
    exit 0
fi

# Get days parameter
if [ -z "$1" ]; then
    echo "How many days of backups do you want to KEEP?"
    echo ""
    echo "Recommended options:"
    echo "  30  - Keep last month (saves space)"
    echo "  90  - Keep last quarter (good balance)"
    echo "  180 - Keep last 6 months (safe)"
    echo "  365 - Keep last year (very safe)"
    echo ""
    read -p "Keep backups from the last [90] days: " DAYS
    DAYS=${DAYS:-90}
else
    DAYS=$1
fi

# Validate input
if ! [[ "$DAYS" =~ ^[0-9]+$ ]]; then
    echo -e "${RED}Error: Invalid number of days${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Searching for backups older than $DAYS days...${NC}"
echo ""

# Find files older than specified days
OLD_FILES=$(find "$BACKUP_DIR" -name "*.exe" -type f -mtime +$DAYS 2>/dev/null)
OLD_COUNT=$(echo "$OLD_FILES" | grep -c "exe" 2>/dev/null || echo "0")

if [ "$OLD_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✓ No backups older than $DAYS days found${NC}"
    echo ""
    echo "Most recent backups:"
    ls -lht "$BACKUP_DIR"/*.exe 2>/dev/null | head -5 | awk '{print "  " $9 " - " $6 " " $7 " " $8 " (" $5 ")"}'
    exit 0
fi

# Calculate space to be freed
SPACE_TO_FREE=0
while IFS= read -r file; do
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        SPACE_TO_FREE=$((SPACE_TO_FREE + SIZE))
    fi
done <<< "$OLD_FILES"

SPACE_TO_FREE_MB=$((SPACE_TO_FREE / 1024 / 1024))

echo -e "${YELLOW}Found $OLD_COUNT backups older than $DAYS days${NC}"
echo "Space that will be freed: ${SPACE_TO_FREE_MB}MB"
echo ""

# Show files to be deleted
echo "Files to be deleted:"
while IFS= read -r file; do
    if [ -f "$file" ]; then
        FILE_DATE=$(stat -f%Sm -t "%Y-%m-%d" "$file" 2>/dev/null || stat -c%y "$file" | cut -d' ' -f1 2>/dev/null)
        FILE_SIZE=$(du -h "$file" | cut -f1)
        BASENAME=$(basename "$file")
        echo "  - $BASENAME ($FILE_DATE, $FILE_SIZE)"
    fi
done <<< "$OLD_FILES"

echo ""
echo -e "${RED}WARNING: This action cannot be undone!${NC}"
read -p "Delete these $OLD_COUNT backups? [y/N] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

# Delete old files
echo ""
echo -e "${YELLOW}Deleting old backups...${NC}"

DELETED=0
while IFS= read -r file; do
    if [ -f "$file" ]; then
        rm "$file"
        if [ $? -eq 0 ]; then
            DELETED=$((DELETED + 1))
            echo "  ✓ Deleted: $(basename "$file")"
        else
            echo "  ✗ Failed: $(basename "$file")"
        fi
    fi
done <<< "$OLD_FILES"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✓ Cleanup Complete${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Deleted: $DELETED files (~${SPACE_TO_FREE_MB}MB freed)"

# Show remaining backups
REMAINING=$(ls -1 "$BACKUP_DIR"/*.exe 2>/dev/null | wc -l | tr -d ' ')
REMAINING_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
echo "Remaining: $REMAINING backups ($REMAINING_SIZE)"
echo ""

if [ "$REMAINING" -gt 0 ]; then
    echo "Most recent backups:"
    ls -lht "$BACKUP_DIR"/*.exe 2>/dev/null | head -5 | awk '{print "  " $9 " - " $6 " " $7 " " $8 " (" $5 ")"}'
fi
