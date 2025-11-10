# SDIWare Upload System - Complete Guide

**Recommended workflow for uploading new releases with automatic backups.**

---

## 🚀 Quick Start (First Time Setup)

### Step 1: Run Setup Script

```bash
chmod +x setup-r2-config.sh
./setup-r2-config.sh
```

This will:
- Configure your Cloudflare Account ID
- Set up AWS CLI with R2 credentials
- Create configuration file

**You'll need:**
- Cloudflare Account ID (from R2 dashboard)
- R2 Access Key ID
- R2 Secret Access Key

**Where to get credentials:**
1. Go to https://dash.cloudflare.com
2. Navigate to R2 → "Manage R2 API Tokens"
3. Create API token with "Object Read & Write" permissions
4. Save the credentials shown

### Step 2: Test Upload

```bash
chmod +x upload-with-backup.sh
./upload-with-backup.sh /path/to/SDIWare-Installer.exe
```

**That's it!** ✅

---

## 📦 Regular Uploads (After Setup)

Every time you have a new release:

```bash
./upload-with-backup.sh /path/to/SDIWare-Installer.exe
```

**What happens automatically:**
1. ✅ Downloads current version from R2 (backup)
2. ✅ Uploads your new version
3. ✅ Saves backup with timestamp: `~/sdiware-backups/SDIWare-Installer-YYYYMMDD-HHMMSS.exe`
4. ✅ Shows backup history

---

## 🔄 Rollback to Previous Version

If you need to revert to a previous version:

```bash
# List available backups
ls -lht ~/sdiware-backups/

# Upload a previous version
./upload-with-backup.sh ~/sdiware-backups/SDIWare-Installer-20250110-143000.exe
```

---

## 🧹 Cleanup Old Backups

Backups are stored locally in `~/sdiware-backups/`. Clean them up periodically:

```bash
chmod +x cleanup-old-backups.sh

# Interactive mode (asks you how many days to keep)
./cleanup-old-backups.sh

# Or specify days directly
./cleanup-old-backups.sh 90  # Keep last 90 days
```

**Recommended:** Keep 90-180 days of backups

---

## 📂 File Structure

```
SDIWare-website/
├── setup-r2-config.sh          # One-time setup
├── upload-with-backup.sh       # Main upload script (use this!)
├── cleanup-old-backups.sh      # Manage backups
├── .r2-config                  # Your credentials (auto-generated, not in git)
└── ~/sdiware-backups/          # Local backup storage
    ├── SDIWare-Installer-20250110-143000.exe
    ├── SDIWare-Installer-20250115-091500.exe
    └── SDIWare-Installer-20250120-165230.exe
```

---

## 🎯 How It Works

### Current R2 Behavior:
- Only **1 version** exists in R2 at any time
- Filename is always: `SDIWare-Installer.exe`
- Each upload **overwrites** the previous file
- Old version is automatically deleted from R2

### Backup System:
- Before uploading, downloads current version from R2
- Saves it locally with timestamp
- Gives you rollback capability
- No extra R2 storage costs

**Best of both worlds:**
- ✅ Simple R2 setup (single file)
- ✅ Low storage costs in R2
- ✅ Rollback capability (local backups)
- ✅ Automatic backup process

---

## 🔒 Security

### Configuration File (`.r2-config`)
- Contains your R2 endpoint URL
- Does NOT contain credentials (those are in `~/.aws/credentials`)
- Automatically excluded from git (in `.gitignore`)
- Safe to keep on your local machine

### AWS Credentials
- Stored in `~/.aws/credentials` (AWS CLI standard location)
- Profile name: `r2`
- Never committed to git
- Encrypted by OS keychain (on macOS)

### Best Practices:
- ✅ Keep credentials in password manager
- ✅ Rotate R2 API tokens every 6-12 months
- ✅ Use separate tokens for each team member (see TEAM-ACCESS-README.md)
- ❌ Never commit `.r2-config` or `.aws/credentials`
- ❌ Never share credentials via email/Slack unencrypted

---

## 🔧 Troubleshooting

### "Error: R2 not configured"

**Solution:** Run the setup script first:
```bash
./setup-r2-config.sh
```

### "Error: Unable to locate credentials"

**Solution:** Configure AWS CLI:
```bash
aws configure --profile r2
```

When prompted:
- Access Key ID: [Your R2 Access Key ID]
- Secret Access Key: [Your R2 Secret Access Key]
- Region: `auto`
- Output format: `json`

### "Error: Could not connect to endpoint"

**Possible causes:**
1. Wrong Account ID in `.r2-config`
2. No internet connection
3. R2 API token expired

**Solution:**
- Verify Account ID in Cloudflare dashboard
- Check internet connection
- Try creating a new R2 API token

### Upload succeeds but no backup created

**Explanation:** This is normal for the first upload (no existing file to backup)

### "Permission denied" when running scripts

**Solution:** Make scripts executable:
```bash
chmod +x setup-r2-config.sh upload-with-backup.sh cleanup-old-backups.sh
```

---

## 👥 Team Access

To give your R&D team upload access, see:
- **TEAM-ACCESS-README.md** - Quick start for team access
- **TEAM-ACCESS-GUIDE.md** - Complete guide with 3 methods

**Recommended for teams:**
1. Upload Portal (web interface - easiest)
2. Individual R2 tokens (most secure)
3. This script-based approach (for technical team members)

---

## 📊 Storage & Costs

### R2 Storage (Cloudflare):
- **Current:** 1 file (~500MB) = ~$0.0075/month = ~$0.09/year
- **Cost per version:** ~$0.09/year
- **10 versions:** ~$0.90/year (if you kept them all in R2)

### Local Backups:
- **Free** (uses your disk space)
- **Example:** 10 versions × 500MB = 5GB local storage
- Clean up old backups periodically

**Bottom line:** Storage costs are negligible ✅

---

## 📚 Additional Documentation

| File | Purpose |
|------|---------|
| **UPLOAD-README.md** | This file - complete upload guide |
| **QUICK-UPLOAD.md** | Quick reference card |
| **VERSION-MANAGEMENT.md** | Version control strategies |
| **R2-UPLOAD-GUIDE.md** | Technical R2 documentation |
| **TEAM-ACCESS-README.md** | Team access quick start |
| **TEAM-ACCESS-GUIDE.md** | Complete team access guide |

---

## 🎓 Commands Reference

```bash
# One-time setup
./setup-r2-config.sh

# Upload new version (with automatic backup)
./upload-with-backup.sh /path/to/installer.exe

# Rollback to previous version
./upload-with-backup.sh ~/sdiware-backups/SDIWare-Installer-DATE.exe

# Clean up old backups
./cleanup-old-backups.sh 90

# List backups
ls -lht ~/sdiware-backups/

# Check R2 configuration
cat .r2-config

# Test R2 connection
aws s3 ls s3://sdiware/ --endpoint-url https://YOUR_ACCOUNT.r2.cloudflarestorage.com --profile r2
```

---

## ✅ Checklist

**Initial Setup:**
- [ ] Run `./setup-r2-config.sh`
- [ ] Configure AWS CLI with R2 credentials
- [ ] Test upload with dummy file
- [ ] Verify backup was created in `~/sdiware-backups/`

**Regular Workflow:**
- [ ] Build new installer
- [ ] Test installer locally
- [ ] Run `./upload-with-backup.sh /path/to/installer.exe`
- [ ] Verify upload succeeded
- [ ] Test download from https://sdiware.video

**Quarterly Maintenance:**
- [ ] Review backup directory size
- [ ] Run `./cleanup-old-backups.sh 90`
- [ ] Check R2 storage usage in Cloudflare dashboard
- [ ] Verify R2 API token is still valid

---

## 🆘 Support

**Common Issues:**
- See Troubleshooting section above
- Check AWS CLI configuration: `aws configure list --profile r2`
- Verify R2 endpoint in `.r2-config`
- Review Cloudflare R2 dashboard for errors

**For Team:**
- Individual access: See TEAM-ACCESS-GUIDE.md
- Upload portal: See TEAM-ACCESS-README.md
- GitHub Actions: See TEAM-ACCESS-GUIDE.md → Option 3

---

## 🎯 Summary

**You chose the recommended approach:** ✅

✅ **Simple** - Just run one script
✅ **Safe** - Automatic backups before every upload
✅ **Low cost** - No extra R2 storage costs
✅ **Rollback** - Keep local backups for recovery

**Main command to remember:**
```bash
./upload-with-backup.sh /path/to/SDIWare-Installer.exe
```

That's it! 🚀
