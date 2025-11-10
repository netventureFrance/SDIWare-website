# Email Template for R&D Team

---

**Subject:** SDIWare Release Upload System - New Process

---

Hi Team,

We've set up a new system for uploading SDIWare installer releases to our distribution platform. This replaces the manual process and gives everyone on the R&D team the ability to publish new versions.

## 🚀 Quick Start (Easiest Method)

**Upload Portal:** https://sdiware.video/admin-upload.html

**Upload Password:** [INSERT PASSWORD HERE - see ADMIN_UPLOAD_SECRET]

**Steps:**
1. Go to the upload portal URL
2. **Enter version number** (e.g., 1.2.0 or 2025.01.10)
3. **Enter your name** (so we know who uploaded)
4. Enter the upload password
5. Select your SDIWare-Installer.exe file
6. Click "Upload to R2"
7. Done! ✅

The new version goes live immediately and is available for download at: https://sdiware.video

**Note:** I'll be notified automatically when you upload (with version info).

---

## 📋 Important Notes

**File Handling:**
- Each upload **replaces** the current installer (only 1 version lives in production)
- The old version is automatically removed
- Make sure to test your build before uploading!

**What Gets Uploaded:**
- File name must be: `SDIWare-Installer.exe`
- File size: Typically 400-600 MB
- Format: Windows executable (.exe)

**Security:**
- Keep the upload password confidential
- Don't share it outside the R&D team
- Contact me if you forget the password

---

## 🔄 Rollback Process

If you need to rollback to a previous version, contact me and I can restore it from our backup system.

---

## 🛠️ Alternative Methods (For Advanced Users)

If you prefer command-line tools, there are also:
- **Bash upload script** (requires AWS CLI setup)
- **Python upload script** (requires boto3)
- **Individual R2 API tokens** (your own credentials)

Full documentation is in the repository: https://github.com/netventureFrance/SDIWare-website

See: `TEAM-ACCESS-README.md` and `TEAM-ACCESS-GUIDE.md`

---

## 📞 Support

Questions or issues? Contact me:
- Email: [YOUR EMAIL]
- Slack: [YOUR SLACK]

Happy releasing! 🎉

Best regards,
[YOUR NAME]

---

**Attachments (Optional):**
- Screenshot of upload portal
- Quick reference guide

