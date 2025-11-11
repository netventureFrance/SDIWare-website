# Cloudflare R2 Upload Guide

Guide for uploading and managing SDIWare-Installer.exe in Cloudflare R2 storage.

## Current Configuration

- **R2 Bucket**: `sdiware`
- **File Name**: `SDIWare-Installer.exe`
- **Access**: Via presigned URLs (15-minute validity)
- **Download System**: Netlify Functions + Airtable + R2

## Method 1: Cloudflare Dashboard (Easiest)

### Steps:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Navigate to **R2** in the sidebar
4. Click on your bucket: **sdiware**
5. Click **Upload** button
6. Select or drag-and-drop `SDIWare-Installer.exe`
7. Confirm upload (this will overwrite the existing file)

**Pros**: Simple, visual interface
**Cons**: Manual process, not suitable for automation

---

## Method 2: AWS CLI (Recommended)

The AWS CLI works with R2 since it's S3-compatible.

### Initial Setup:

#### 1. Install AWS CLI
```bash
# macOS
brew install awscli

# Or download from: https://aws.amazon.com/cli/
```

#### 2. Get R2 Credentials
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Manage R2 API Tokens**
3. Click **Create API Token**
4. Set permissions: **Object Read & Write**
5. Note down:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (for endpoint URL)

#### 3. Configure AWS CLI Profile
```bash
aws configure --profile r2
```

When prompted, enter:
- **AWS Access Key ID**: [Your R2 Access Key ID]
- **AWS Secret Access Key**: [Your R2 Secret Access Key]
- **Default region name**: `auto`
- **Default output format**: `json`

#### 4. Update Script Configuration
Edit `upload-to-r2.sh` and replace:
```bash
R2_ENDPOINT="https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com"
```
With your actual Account ID:
```bash
R2_ENDPOINT="https://abc123def456.r2.cloudflarestorage.com"
```

### Usage:

```bash
# Upload installer
./upload-to-r2.sh /path/to/SDIWare-Installer.exe
```

**Pros**: Fast, automatable, scriptable
**Cons**: Requires initial setup

---

## Method 3: Direct AWS CLI Commands

After configuring AWS CLI (see Method 2), you can use direct commands:

### Upload File:
```bash
aws s3 cp SDIWare-Installer.exe s3://sdiware/SDIWare-Installer.exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2
```

### List Files:
```bash
aws s3 ls s3://sdiware/ \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2
```

### Check File Info:
```bash
aws s3 ls s3://sdiware/SDIWare-Installer.exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2 \
  --human-readable
```

### Delete File:
```bash
aws s3 rm s3://sdiware/SDIWare-Installer.exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2
```

---

## Method 4: Using Rclone

Rclone is another popular tool for managing cloud storage.

### Setup:
```bash
# Install rclone
brew install rclone

# Configure R2 endpoint
rclone config
```

Follow prompts:
- Choose: **New remote**
- Name: `r2`
- Storage: **Amazon S3 Compliant Storage** (option 5)
- Provider: **Cloudflare R2** (option 5)
- Enter Access Key and Secret Key
- Endpoint: `https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com`

### Usage:
```bash
# Upload
rclone copy SDIWare-Installer.exe r2:sdiware/

# List files
rclone ls r2:sdiware/

# Sync directory
rclone sync ./installers/ r2:sdiware/
```

---

## Version Management Best Practices

### Option 1: Keep Multiple Versions
Instead of overwriting, you could store multiple versions:
```
SDIWare-Installer-v1.0.0.exe
SDIWare-Installer-v1.1.0.exe
SDIWare-Installer.exe  (symlink/latest)
```

Then update your `download.js` to reference the latest version.

### Option 2: Use R2 Bucket Versioning
Cloudflare R2 doesn't have built-in versioning yet, but you can:
1. Keep backups locally
2. Use git-lfs for version control
3. Store in a separate `/archive` folder in R2

---

## Troubleshooting

### AWS CLI Not Finding Credentials
```bash
# Verify profile exists
aws configure list --profile r2

# Test connection
aws s3 ls --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com --profile r2
```

### Permission Denied
- Ensure R2 API token has **Object Read & Write** permissions
- Check bucket name is correct: `sdiware`

### File Not Updating
- R2 might cache files. Wait a few minutes or clear CDN cache
- Verify file was actually uploaded: use `aws s3 ls` command

---

## Security Notes

1. **Never commit R2 credentials** to git
2. Keep credentials in:
   - AWS CLI config (`~/.aws/credentials`)
   - Environment variables (for CI/CD)
   - Netlify environment variables (already configured)
3. Use **minimal permissions** for API tokens (Read & Write only what's needed)
4. Rotate credentials periodically

---

## Current Environment Variables (Netlify)

These are already configured in your Netlify dashboard:
```
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
```

**Note**: These are only for the Netlify Function. You need separate AWS CLI configuration for local uploads.

---

## Quick Reference

| Task | Command |
|------|---------|
| Upload with script | `./upload-to-r2.sh /path/to/file.exe` |
| Upload with AWS CLI | `aws s3 cp file.exe s3://sdiware/ --endpoint-url URL --profile r2` |
| List files | `aws s3 ls s3://sdiware/ --endpoint-url URL --profile r2` |
| Dashboard | https://dash.cloudflare.com → R2 → sdiware |

---

## Support

For issues with:
- **R2 Storage**: Cloudflare Support / Dashboard
- **Upload Script**: Check this guide or AWS CLI documentation
- **Download Function**: Check Netlify Function logs
- **Airtable Integration**: Check Airtable base and API key

