# R2 Team Access Guide

Guide for giving your R&D team secure access to upload SDIWare releases to Cloudflare R2.

## Recommended Approach

**Option 1**: Individual R2 API Tokens (Most Secure)
**Option 2**: Shared Upload Portal (Easiest for team)
**Option 3**: GitHub Actions (Best for automation)
**Option 4**: Shared Credentials (Least secure, not recommended)

---

## Option 1: Individual R2 API Tokens ⭐ Recommended

Give each team member their own R2 API token for accountability and security.

### Setup Steps:

#### 1. Create API Token for Each Team Member

For each team member:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Manage R2 API Tokens**
3. Click **Create API Token**
4. Configure:
   - **Token Name**: `sdiware-upload-[team-member-name]` (e.g., `sdiware-upload-john`)
   - **Permissions**:
     - ✅ Object Read & Write
     - ❌ Admin Read & Write (NOT needed)
   - **R2 Bucket**: Select `sdiware` (limit to this bucket only)
   - **TTL**: Optional (e.g., 1 year, then rotate)
5. Click **Create API Token**
6. **Save credentials**:
   - Access Key ID
   - Secret Access Key
   - Account ID (same for all team members)

#### 2. Share Setup Instructions with Team

Send each team member:

**Email Template:**
```
Hi [Name],

You now have upload access to the SDIWare R2 bucket.

Your Credentials:
- Access Key ID: [their-access-key-id]
- Secret Access Key: [their-secret-access-key]
- Account ID: [your-account-id]
- Bucket: sdiware

Setup Instructions:

1. Clone the repository:
   git clone https://github.com/netventureFrance/SDIWare-website.git
   cd SDIWare-website

2. Configure AWS CLI:
   brew install awscli  # macOS
   aws configure --profile r2

   When prompted, enter:
   - AWS Access Key ID: [their-access-key-id]
   - AWS Secret Access Key: [their-secret-access-key]
   - Default region: auto
   - Default output format: json

3. Update upload script:
   Edit upload-to-r2.sh line 11:
   R2_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"

4. Upload a release:
   ./upload-to-r2.sh /path/to/SDIWare-Installer.exe

Security:
- Keep credentials confidential
- Never commit credentials to git
- Report any issues immediately

Best,
[Your name]
```

### Advantages:
✅ Individual accountability (know who uploaded what)
✅ Easy to revoke access for individual team members
✅ Audit trail in Cloudflare logs
✅ Each person uses their own credentials

### Disadvantages:
❌ Requires manual credential distribution
❌ Need to create token for each person
❌ Team needs to configure AWS CLI locally

---

## Option 2: Shared Upload Portal 🌐

Create a simple web interface where team members can upload files.

### Setup:

#### 1. Create Upload Function

Create `netlify/functions/admin-upload.js`:

```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multipart = require('lambda-multipart-parser');

// Simple authentication (CHANGE THIS SECRET!)
const UPLOAD_SECRET = process.env.ADMIN_UPLOAD_SECRET || 'change-me-to-a-strong-password';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse multipart form data
    const result = await multipart.parse(event);

    // Check authentication
    const providedSecret = result.secret;
    if (providedSecret !== UPLOAD_SECRET) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid authentication' })
      };
    }

    // Get uploaded file
    const file = result.files.find(f => f.fieldname === 'installer');
    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
      Body: file.content,
      ContentType: 'application/x-msdownload',
    });

    await r2Client.send(uploadCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Upload successful!',
        filename: file.filename,
        size: file.content.length
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upload failed' })
    };
  }
};
```

#### 2. Create Upload Page

Create `admin-upload.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SDIWare Upload Portal</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: #3d4f5c;
            margin-bottom: 0.5rem;
        }
        .subtitle {
            color: #666;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 600;
        }
        input[type="password"],
        input[type="file"] {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-family: inherit;
        }
        input[type="password"]:focus,
        input[type="file"]:focus {
            outline: none;
            border-color: #00d4aa;
        }
        .file-info {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: #666;
        }
        .btn {
            width: 100%;
            background: #00d4aa;
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn:hover:not(:disabled) {
            background: #00b894;
            transform: translateY(-2px);
        }
        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .message {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 0.5rem;
            display: none;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .progress {
            display: none;
            margin-top: 1rem;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #00d4aa;
            width: 0%;
            transition: width 0.3s ease;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SDIWare Upload Portal</h1>
        <p class="subtitle">Upload new installer releases to R2</p>

        <div class="warning">
            ⚠️ <strong>Warning:</strong> This will overwrite the current SDIWare-Installer.exe file.
        </div>

        <form id="uploadForm">
            <div class="form-group">
                <label for="secret">Upload Password:</label>
                <input type="password" id="secret" name="secret" required
                       placeholder="Enter upload password">
            </div>

            <div class="form-group">
                <label for="installer">Installer File (.exe):</label>
                <input type="file" id="installer" name="installer"
                       accept=".exe" required>
                <div class="file-info" id="fileInfo"></div>
            </div>

            <button type="submit" class="btn" id="uploadBtn">
                Upload to R2
            </button>

            <div class="progress" id="progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </div>

            <div class="message" id="message"></div>
        </form>
    </div>

    <script>
        const form = document.getElementById('uploadForm');
        const fileInput = document.getElementById('installer');
        const fileInfo = document.getElementById('fileInfo');
        const uploadBtn = document.getElementById('uploadBtn');
        const message = document.getElementById('message');
        const progress = document.getElementById('progress');
        const progressFill = document.getElementById('progressFill');

        // Show file info when selected
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(2);
                fileInfo.textContent = `Selected: ${file.name} (${sizeMB} MB)`;
            }
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const secret = document.getElementById('secret').value;
            const file = fileInput.files[0];

            if (!file) {
                showMessage('Please select a file', 'error');
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('secret', secret);
            formData.append('installer', file);

            // Show progress
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Uploading...';
            progress.style.display = 'block';
            message.style.display = 'none';

            try {
                const response = await fetch('/.netlify/functions/admin-upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(`✓ Upload successful! ${data.filename} (${(data.size / 1024 / 1024).toFixed(2)} MB)`, 'success');
                    form.reset();
                    fileInfo.textContent = '';
                } else {
                    showMessage(`✗ Upload failed: ${data.error}`, 'error');
                }

            } catch (error) {
                showMessage(`✗ Upload error: ${error.message}`, 'error');
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Upload to R2';
                progress.style.display = 'none';
                progressFill.style.width = '0%';
            }
        });

        function showMessage(text, type) {
            message.textContent = text;
            message.className = `message ${type}`;
            message.style.display = 'block';
        }
    </script>
</body>
</html>
```

#### 3. Configure Environment Variables in Netlify

Add to your Netlify environment variables:
```
ADMIN_UPLOAD_SECRET=your-strong-password-here-share-with-team
```

#### 4. Install Dependencies

```bash
npm install lambda-multipart-parser --save
```

#### 5. Share with Team

Send team members:
- URL: `https://sdiware.video/admin-upload.html`
- Password: The `ADMIN_UPLOAD_SECRET` value

### Advantages:
✅ No local setup needed for team
✅ Simple web interface
✅ Works from any device/OS
✅ Single password to manage

### Disadvantages:
❌ Shared password (less accountability)
❌ Requires Netlify function deployment
❌ No built-in version control

---

## Option 3: GitHub Actions (Automated) 🤖

Let team upload via GitHub releases, auto-sync to R2.

### Setup:

#### 1. Create GitHub Action

Create `.github/workflows/upload-to-r2.yml`:

```yaml
name: Upload to R2

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      asset_url:
        description: 'Direct URL to .exe file'
        required: true

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Download installer
        run: |
          if [ "${{ github.event_name }}" == "release" ]; then
            DOWNLOAD_URL=$(echo '${{ toJson(github.event.release.assets) }}' | jq -r '.[0].browser_download_url')
          else
            DOWNLOAD_URL="${{ github.event.inputs.asset_url }}"
          fi
          curl -L -o SDIWare-Installer.exe "$DOWNLOAD_URL"

      - name: Upload to R2
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_ENDPOINT: ${{ secrets.R2_ENDPOINT }}
        run: |
          aws s3 cp SDIWare-Installer.exe s3://sdiware/SDIWare-Installer.exe \
            --endpoint-url $R2_ENDPOINT
```

#### 2. Add Secrets to GitHub

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_ENDPOINT`

#### 3. Team Usage

Team members create a GitHub Release:
1. Go to Releases → Draft a new release
2. Tag version (e.g., `v1.2.0`)
3. Upload `SDIWare-Installer.exe` as asset
4. Publish release
5. GitHub Action automatically uploads to R2

### Advantages:
✅ Version control built-in
✅ Release notes alongside uploads
✅ Automatic (no manual upload needed)
✅ Works with GitHub permissions

### Disadvantages:
❌ Requires GitHub knowledge
❌ .exe files in git (use releases)
❌ More complex setup

---

## Option 4: Shared Credentials ⚠️ Not Recommended

Share single R2 API token with entire team.

### Why Not Recommended:
- ❌ No accountability (can't tell who uploaded what)
- ❌ If one person leaves, must rotate for everyone
- ❌ Single point of failure
- ❌ Difficult to audit

**Use Option 1 or 2 instead.**

---

## Security Best Practices

### For All Options:

1. **Use Strong Passwords/Tokens**
   - Generate random passwords: `openssl rand -base64 32`
   - Never reuse passwords

2. **Rotate Credentials**
   - Rotate API tokens every 6-12 months
   - Update team when rotated

3. **Limit Permissions**
   - Only grant "Object Read & Write" on `sdiware` bucket
   - Never grant admin access

4. **Monitor Access**
   - Check Cloudflare logs regularly
   - Review who has access quarterly

5. **Revoke Access**
   - Remove tokens for departing team members immediately
   - Keep list of active tokens

### Credential Storage:

✅ **DO:**
- Use password managers (1Password, LastPass, Bitwarden)
- Store in encrypted files
- Use environment variables
- Keep in secure company wiki

❌ **DON'T:**
- Email credentials unencrypted
- Store in Slack/Discord
- Commit to git repositories
- Share in plaintext documents

---

## Audit Trail

### Track Uploads:

**Cloudflare R2 Logs:**
- Dashboard → R2 → sdiware → Logs
- Shows all upload activity with timestamps

**For Better Tracking:**
Add logging to upload scripts:

```bash
# In upload-to-r2.sh, add after upload:
echo "$(date): Uploaded by $(whoami) from $(hostname)" >> upload-log.txt
```

---

## Recommended Setup for Most Teams

**For Small Teams (2-5 people):**
→ **Option 1: Individual API Tokens**

**For Larger Teams or Non-Technical:**
→ **Option 2: Shared Upload Portal**

**For DevOps/Automated Release Process:**
→ **Option 3: GitHub Actions**

---

## Quick Comparison Table

| Method | Setup Time | Security | Ease of Use | Audit Trail |
|--------|-----------|----------|-------------|-------------|
| Individual Tokens | 30 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Upload Portal | 1-2 hours | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| GitHub Actions | 1 hour | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Shared Creds | 5 min | ⭐ | ⭐⭐⭐⭐ | ⭐ |

---

## Need Help?

- R2 Documentation: https://developers.cloudflare.com/r2/
- AWS CLI with R2: See `R2-UPLOAD-GUIDE.md`
- Troubleshooting: See `QUICK-UPLOAD.md`
