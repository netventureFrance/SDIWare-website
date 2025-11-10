# Quick Upload Reference

## TL;DR - Upload New Installer

### Option 1: Cloudflare Dashboard (5 minutes)
1. Go to https://dash.cloudflare.com
2. R2 → `sdiware` bucket
3. Upload → Select `SDIWare-Installer.exe`
4. Done ✓

### Option 2: Bash Script (After initial setup)
```bash
./upload-to-r2.sh /path/to/SDIWare-Installer.exe
```

### Option 3: Python Script (After initial setup)
```bash
python upload-to-r2.py /path/to/SDIWare-Installer.exe
```

### Option 4: AWS CLI Direct
```bash
aws s3 cp SDIWare-Installer.exe s3://sdiware/SDIWare-Installer.exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2
```

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

