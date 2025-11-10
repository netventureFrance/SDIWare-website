# Team Access Setup - Quick Start

Three ways to give your R&D team upload access to the SDIWare installer.

## 🎯 Choose Your Method:

### Method 1: Upload Portal (Easiest) ⭐
**Best for:** Non-technical team members, quick setup

**What you get:** Web interface at `https://sdiware.video/admin-upload.html`

**Setup time:** 15 minutes

**Steps:**
1. Add to Netlify environment variables:
   ```
   ADMIN_UPLOAD_SECRET=your-strong-password-here
   ```
2. Share URL and password with team
3. Team uploads via browser - done!

**Full guide:** See `TEAM-ACCESS-GUIDE.md` → Option 2

---

### Method 2: Individual R2 Tokens (Most Secure)
**Best for:** Technical teams, need audit trail

**What you get:** Each person has their own credentials

**Setup time:** 30 minutes + 5 min per person

**Steps:**
1. Create R2 API token for each team member (Cloudflare Dashboard)
2. Share credentials + upload script with each person
3. Each person configures AWS CLI locally
4. They run: `./upload-to-r2.sh /path/to/installer.exe`

**Full guide:** See `TEAM-ACCESS-GUIDE.md` → Option 1

---

### Method 3: GitHub Actions (Automated)
**Best for:** Release automation, version control

**What you get:** Upload via GitHub releases

**Setup time:** 1 hour

**Steps:**
1. Add R2 credentials to GitHub Secrets
2. Create GitHub Action workflow
3. Team creates releases, auto-uploads to R2

**Full guide:** See `TEAM-ACCESS-GUIDE.md` → Option 3

---

## Quick Comparison

| Method | Setup | Security | Ease | Audit |
|--------|-------|----------|------|-------|
| Upload Portal | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Individual Tokens | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| GitHub Actions | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 Recommended: Start with Upload Portal

For most teams, we recommend starting with the **Upload Portal** (Method 1):

1. It's the easiest to set up
2. Works immediately with no local configuration
3. Team can upload from any device
4. Can switch to individual tokens later if needed

**Setup in 3 steps:**

```bash
# 1. The upload portal is already created in your repo
# Files: admin-upload.html, netlify/functions/admin-upload.js

# 2. Add password to Netlify
# Go to: Netlify Dashboard → Site Settings → Environment Variables
# Add: ADMIN_UPLOAD_SECRET = your-strong-password

# 3. Share with team
# URL: https://sdiware.video/admin-upload.html
# Password: [the password you set above]
```

Done! ✅

---

## Files in This Repo

```
📁 Team Access Files:
├── TEAM-ACCESS-GUIDE.md        # Comprehensive guide (all 4 methods)
├── TEAM-ACCESS-README.md       # This file (quick start)
├── admin-upload.html           # Upload portal interface
├── netlify/functions/
│   └── admin-upload.js         # Upload portal backend
├── upload-to-r2.sh             # Bash upload script
├── upload-to-r2.py             # Python upload script
├── R2-UPLOAD-GUIDE.md          # R2 technical documentation
└── QUICK-UPLOAD.md             # Quick reference card
```

---

## Security Notes

**For Upload Portal:**
- Use a strong password: `openssl rand -base64 24`
- Change password every 6 months
- Don't share password via email (use password manager)

**For Individual Tokens:**
- Create separate token per person
- Revoke tokens when people leave
- Check Cloudflare logs monthly

**For All Methods:**
- Never commit credentials to git
- Use HTTPS only
- Monitor upload activity

---

## Support & Help

- **Detailed Setup:** `TEAM-ACCESS-GUIDE.md`
- **R2 Documentation:** `R2-UPLOAD-GUIDE.md`
- **Quick Reference:** `QUICK-UPLOAD.md`
- **Cloudflare R2 Docs:** https://developers.cloudflare.com/r2/

---

## Current Environment Variables Needed

### For Upload Portal:
```bash
ADMIN_UPLOAD_SECRET=your-password  # Add this in Netlify
```

### Already Configured in Netlify:
```bash
R2_ENDPOINT=https://....r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

---

## Next Steps

1. **Choose method** from above
2. **Read full guide:** `TEAM-ACCESS-GUIDE.md`
3. **Set up credentials** (Netlify or Cloudflare)
4. **Test upload** with dummy file first
5. **Share with team** (URL + credentials)

**Questions?** See full guides in this directory.
