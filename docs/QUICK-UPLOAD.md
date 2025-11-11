# Quick Upload Reference

## ⭐ RECOMMENDED: Upload with Automatic Backup

```bash
./upload-with-backup.sh /path/to/SDIWare-Installer.exe
```

**Why this is best:**
- ✅ Automatic backup before upload
- ✅ Easy rollback if needed
- ✅ Simple one-command process

**First time?** Run setup first: `./setup-r2-config.sh`

---

## Alternative Methods

### Option 1: Cloudflare Dashboard (Manual)
1. Go to https://dash.cloudflare.com
2. R2 → `sdiware` bucket
3. Upload → Select `SDIWare-Installer.exe`
4. Done ✓

**Note:** No automatic backup with this method

### Option 2: Upload Portal (For Team)
1. Go to https://sdiware.video/admin-upload.html
2. Enter team password
3. Upload file
4. Done ✓

**Setup:** See TEAM-ACCESS-README.md

### Option 3: Individual Scripts (Advanced)
```bash
./upload-to-r2.sh /path/to/SDIWare-Installer.exe
# or
python upload-to-r2.py /path/to/SDIWare-Installer.exe
```

**Note:** No automatic backup with these methods

---

## First Time Setup

### For Bash/Python Scripts:

1. **Get R2 Credentials:**
   - Cloudflare Dashboard → R2 → Manage R2 API Tokens
   - Create token with "Object Read & Write"
   - Save: Access Key ID, Secret Access Key, Account ID

2. **Configure AWS CLI:**
   ```bash
   # Install AWS CLI
   brew install awscli

   # Configure profile
   aws configure --profile r2
   # Enter: Access Key ID, Secret Access Key, region=auto
   ```

3. **Update Scripts:**
   - Edit `upload-to-r2.sh` or `upload-to-r2.py`
   - Replace `YOUR_ACCOUNT_ID` with your actual Account ID

4. **For Python (optional):**
   ```bash
   pip install boto3
   ```

---

## Verify Upload

### Check via Dashboard:
https://dash.cloudflare.com → R2 → sdiware

### Check via CLI:
```bash
aws s3 ls s3://sdiware/ \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2 \
  --human-readable
```

---

## Test Download

After uploading:
1. Go to https://sdiware.video/#download
2. Fill out download form
3. Check email for download link
4. Click link to verify new installer downloads

---

## Troubleshooting

**Upload fails?**
- Check credentials in `aws configure list --profile r2`
- Verify Account ID in endpoint URL
- Check R2 API token has write permissions

**File not updating?**
- Wait 2-3 minutes for R2 cache
- Clear browser cache
- Verify filename is exactly: `SDIWare-Installer.exe`

**Need help?**
- See full guide: `R2-UPLOAD-GUIDE.md`
- Check Netlify function logs for download issues
- Verify Airtable records are being created

---

## Current Setup

- **Bucket**: `sdiware`
- **File**: `SDIWare-Installer.exe`
- **Download System**: Netlify Function → Airtable → R2 Presigned URL
- **Link Validity**: 48 hours (in Airtable), 15 minutes (presigned URL)
- **Trial Period**: 30 days

