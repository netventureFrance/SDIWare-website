# R2 Version Management Guide

How old installer versions are handled and options for version control.

---

## Current Setup: Auto-Replace (No Versioning)

### How It Works Now:

**Every upload uses the same filename:** `SDIWare-Installer.exe`

When your team uploads a new installer:
1. ✅ New file is uploaded to R2
2. ❌ Old file is **automatically overwritten** (deleted)
3. ✅ Only 1 version exists at any time

### Advantages:
✅ **Simple** - No cleanup needed
✅ **Low storage** - Never accumulates old files
✅ **No cost increase** - Storage stays constant
✅ **Always latest** - Download link always serves newest version

### Disadvantages:
❌ **No rollback** - Can't go back to previous version
❌ **No history** - Can't see what changed
❌ **No backup** - If bad version uploaded, old one is gone
❌ **No audit trail** - Can't track which versions were deployed when

---

## Do You Need Version Management?

### You DON'T need versioning if:
- ✅ You test thoroughly before uploading
- ✅ You have local backups of all releases
- ✅ You rarely need to rollback
- ✅ Storage simplicity is important

### You DO need versioning if:
- ❌ You want to rollback quickly if issues arise
- ❌ You want historical record in R2
- ❌ You need compliance/audit trail
- ❌ You want to offer multiple versions to users

---

## Option 1: Keep Current Setup (Recommended)

**What to do:** Nothing - keep auto-replace behavior

**Best practice - Manual backups:**
```bash
# Before uploading new version, backup locally:
mkdir -p ~/sdiware-backups
aws s3 cp s3://sdiware/SDIWare-Installer.exe \
  ~/sdiware-backups/SDIWare-Installer-$(date +%Y%m%d).exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2

# Then upload new version
./upload-to-r2.sh /path/to/new-installer.exe
```

**Advantages:**
- Simple, no changes needed
- Low storage costs
- Backups under your control

---

## Option 2: Add Versioning to R2 (Archive Old Versions)

Keep old versions in an `/archive` folder in the same bucket.

### Implementation:

#### Update Upload Function

Modify `netlify/functions/admin-upload.js`:

```javascript
const { S3Client, PutObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');

// Before uploading new file, archive the old one
async function archiveOldVersion(r2Client) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveKey = `archive/SDIWare-Installer-${timestamp}.exe`;

  try {
    // Copy current version to archive
    await r2Client.send(new CopyObjectCommand({
      Bucket: 'sdiware',
      CopySource: 'sdiware/SDIWare-Installer.exe',
      Key: archiveKey,
    }));

    console.log('Archived old version to:', archiveKey);
    return archiveKey;
  } catch (error) {
    console.log('No existing file to archive or archive failed:', error.message);
    return null;
  }
}

// In upload handler, before uploading:
await archiveOldVersion(r2Client);

// Then upload new version (existing code)
const uploadCommand = new PutObjectCommand({
  Bucket: 'sdiware',
  Key: 'SDIWare-Installer.exe',
  Body: filepart.data,
  ContentType: 'application/x-msdownload',
});
```

### Bucket Structure:
```
sdiware/
├── SDIWare-Installer.exe                    (current/latest)
└── archive/
    ├── SDIWare-Installer-2025-01-10.exe
    ├── SDIWare-Installer-2025-01-15.exe
    └── SDIWare-Installer-2025-01-20.exe
```

### Cleanup Strategy:

**Manual cleanup** (run quarterly):
```bash
# List old archives
aws s3 ls s3://sdiware/archive/ \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2

# Delete archives older than 90 days
aws s3 rm s3://sdiware/archive/ --recursive \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2 \
  --exclude "*" \
  --include "*2024*"  # Adjust date as needed
```

**Automatic cleanup** with Netlify function:
```javascript
// netlify/functions/cleanup-old-versions.js
// Run on schedule or manually
const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');

exports.handler = async (event, context) => {
  const r2Client = new S3Client({...});

  const list = await r2Client.send(new ListObjectsV2Command({
    Bucket: 'sdiware',
    Prefix: 'archive/'
  }));

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep 90 days

  for (const obj of list.Contents || []) {
    if (obj.LastModified < cutoffDate) {
      await r2Client.send(new DeleteObjectCommand({
        Bucket: 'sdiware',
        Key: obj.Key
      }));
      console.log('Deleted old version:', obj.Key);
    }
  }

  return { statusCode: 200, body: 'Cleanup complete' };
};
```

### Advantages:
✅ Version history preserved
✅ Can rollback to any previous version
✅ Audit trail available

### Disadvantages:
❌ Increased storage costs
❌ Requires cleanup management
❌ More complex setup

---

## Option 3: Use Semantic Versioning

Store versions with explicit version numbers in filename.

### Bucket Structure:
```
sdiware/
├── SDIWare-Installer.exe           (symlink to latest)
├── SDIWare-Installer-v1.0.0.exe
├── SDIWare-Installer-v1.1.0.exe
├── SDIWare-Installer-v1.2.0.exe
└── SDIWare-Installer-v2.0.0.exe    (latest)
```

### Implementation:

Update upload portal to accept version number:

```html
<!-- admin-upload.html -->
<div class="form-group">
    <label for="version">Version Number:</label>
    <input type="text" id="version" name="version"
           placeholder="e.g., 1.2.0" pattern="\d+\.\d+\.\d+" required>
</div>
```

Update upload function:

```javascript
// netlify/functions/admin-upload.js
const version = parts.find(p => p.name === 'version')?.data.toString();
const versionedKey = `SDIWare-Installer-v${version}.exe`;

// Upload versioned file
await r2Client.send(new PutObjectCommand({
  Bucket: 'sdiware',
  Key: versionedKey,
  Body: filepart.data,
  ContentType: 'application/x-msdownload',
}));

// Also update "latest" version
await r2Client.send(new PutObjectCommand({
  Bucket: 'sdiware',
  Key: 'SDIWare-Installer.exe',
  Body: filepart.data,
  ContentType: 'application/x-msdownload',
}));
```

### Update Download Function:

Optionally allow users to download specific versions:

```javascript
// netlify/functions/download.js
const version = event.queryStringParameters?.version || 'latest';
const FILE_KEY = version === 'latest'
  ? 'SDIWare-Installer.exe'
  : `SDIWare-Installer-v${version}.exe`;
```

### Advantages:
✅ Clear version tracking
✅ Users can download specific versions
✅ Professional version management

### Disadvantages:
❌ Most complex setup
❌ Requires manual version input
❌ Storage grows over time

---

## Option 4: R2 Object Lifecycle Policies

**Note:** Cloudflare R2 doesn't currently support automatic lifecycle policies like AWS S3. This feature may be added in the future.

When available, you could:
- Auto-delete files older than X days
- Auto-transition old versions to cheaper storage

**Current status:** Not available in R2 (as of January 2025)

---

## Recommended Approach

### For Most Users:

**Option 1** (Current setup) + Local backups

```bash
# Create backup script
#!/bin/bash
# backup-before-upload.sh

BACKUP_DIR="$HOME/sdiware-backups"
mkdir -p "$BACKUP_DIR"

# Download current version from R2
aws s3 cp s3://sdiware/SDIWare-Installer.exe \
  "$BACKUP_DIR/SDIWare-Installer-$(date +%Y%m%d-%H%M%S).exe" \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2

# Now upload new version
./upload-to-r2.sh "$1"
```

Usage:
```bash
./backup-before-upload.sh /path/to/new-installer.exe
```

### For Enterprise/Compliance:

**Option 2** (R2 Archive) with automatic cleanup

Keeps 90 days of history in R2 for quick rollback, then auto-deletes.

---

## Rollback Procedures

### If Using Option 1 (Local Backups):
```bash
# Upload a previous version from backup
./upload-to-r2.sh ~/sdiware-backups/SDIWare-Installer-20250110.exe
```

### If Using Option 2 (R2 Archive):
```bash
# Copy archived version back to current
aws s3 cp s3://sdiware/archive/SDIWare-Installer-2025-01-10.exe \
  s3://sdiware/SDIWare-Installer.exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2
```

### If Using Option 3 (Versioning):
```bash
# Copy specific version to current
aws s3 cp s3://sdiware/SDIWare-Installer-v1.0.0.exe \
  s3://sdiware/SDIWare-Installer.exe \
  --endpoint-url https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com \
  --profile r2
```

---

## Storage Cost Considerations

### Current Setup (Option 1):
- **Cost:** ~$0.015/GB/month
- **Example:** 500MB installer = $0.0075/month (~$0.09/year)
- **Total:** Negligible

### With Versioning (Option 2/3):
- **Cost:** Same rate, but multiplied by number of versions
- **Example:** 10 versions × 500MB = 5GB = $0.075/month (~$0.90/year)
- **Still very cheap** compared to bandwidth costs

### Cloudflare R2 Pricing:
- Storage: $0.015/GB/month
- Class A operations (upload): $4.50 per million
- Class B operations (download): $0.36 per million
- **Egress: FREE** (this is the big saving vs S3)

---

## Decision Matrix

| Need | Recommended Option |
|------|-------------------|
| Simple, low maintenance | Option 1 (current) |
| Quick rollback in production | Option 2 (R2 archive) |
| Offer multiple versions to users | Option 3 (semantic versioning) |
| Compliance/audit requirements | Option 2 or 3 |
| Minimize costs | Option 1 |
| Professional release management | Option 3 |

---

## Implementation Help

Want to implement one of these options? I can help set up:

1. **Option 1 Enhanced**: Backup script before upload
2. **Option 2**: R2 archive with cleanup function
3. **Option 3**: Semantic versioning with version selector

Let me know which approach fits your needs!

---

## Summary

**Current behavior:** Old files are **automatically deleted** when new version is uploaded.

**Recommendation:** Keep current setup + local backups (Option 1)

**If you need more:** Option 2 (R2 archive) for quick rollback capability

**Storage is cheap:** Even with versioning, costs are minimal (~$1/year for 10 versions)
