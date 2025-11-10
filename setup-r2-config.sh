#!/bin/bash

# Setup R2 Configuration
# This script helps you configure R2 credentials and endpoint for upload scripts

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFIG_FILE=".r2-config"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  SDIWare R2 Configuration Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "This script will help you configure R2 access for upload scripts."
echo ""

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Existing configuration found.${NC}"
    read -p "Do you want to reconfigure? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing configuration."
        exit 0
    fi
    echo ""
fi

echo "You'll need your Cloudflare R2 credentials."
echo ""
echo -e "${YELLOW}Where to find these:${NC}"
echo "1. Go to https://dash.cloudflare.com"
echo "2. Navigate to R2 → Manage R2 API Tokens"
echo "3. Create or use existing API token"
echo "4. Note: Account ID is in the R2 dashboard URL"
echo ""

# Get R2 Account ID
read -p "Enter your Cloudflare Account ID: " ACCOUNT_ID
if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}Error: Account ID is required${NC}"
    exit 1
fi

R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

echo ""
echo -e "${GREEN}R2 Endpoint: $R2_ENDPOINT${NC}"
echo ""

# Save configuration
cat > "$CONFIG_FILE" << EOF
# R2 Configuration
# Generated on $(date)
# DO NOT COMMIT THIS FILE TO GIT

R2_ENDPOINT="$R2_ENDPOINT"
R2_BUCKET="sdiware"
R2_FILE_KEY="SDIWare-Installer.exe"
AWS_PROFILE="r2"
BACKUP_DIR="\$HOME/sdiware-backups"
EOF

echo -e "${GREEN}✓ Configuration saved to $CONFIG_FILE${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}AWS CLI not found.${NC}"
    echo ""
    echo "To install AWS CLI:"
    echo "  macOS: brew install awscli"
    echo "  Linux: sudo apt-get install awscli"
    echo "  Or: https://aws.amazon.com/cli/"
    echo ""
    read -p "Press Enter to continue..."
    echo ""
fi

# Check if AWS profile is configured
echo "Checking AWS CLI configuration..."
if aws configure list --profile r2 &> /dev/null; then
    echo -e "${GREEN}✓ AWS CLI profile 'r2' is configured${NC}"
else
    echo -e "${YELLOW}AWS CLI profile 'r2' not found.${NC}"
    echo ""
    echo "Would you like to configure it now?"
    echo "You'll need:"
    echo "  - R2 Access Key ID"
    echo "  - R2 Secret Access Key"
    echo ""
    read -p "Configure now? [y/N] " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Running: aws configure --profile r2"
        echo ""
        echo "When prompted:"
        echo "  - AWS Access Key ID: [Enter your R2 Access Key ID]"
        echo "  - AWS Secret Access Key: [Enter your R2 Secret Access Key]"
        echo "  - Default region name: auto"
        echo "  - Default output format: json"
        echo ""
        read -p "Press Enter to continue..."

        aws configure --profile r2

        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✓ AWS CLI configured successfully${NC}"
        fi
    else
        echo ""
        echo "You can configure it later by running:"
        echo "  aws configure --profile r2"
    fi
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Setup Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Configuration saved to: $CONFIG_FILE"
echo "Upload scripts will now use these settings."
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test upload with:"
echo "   ./upload-with-backup.sh /path/to/SDIWare-Installer.exe"
echo ""
echo "2. Share upload access with team (see TEAM-ACCESS-README.md)"
echo ""
echo -e "${YELLOW}Security reminder:${NC}"
echo "- Never commit $CONFIG_FILE to git (already in .gitignore)"
echo "- Keep your R2 credentials secure"
echo ""
