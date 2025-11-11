# Upload Notification System

Get notified every time your team uploads a new SDIWare release!

---

## ✅ What's New

**Version Tracking:**
- Every upload now requires a **version number** (e.g., 1.2.0 or 2025.01.10)
- Uploader must enter their **name**
- Version and uploader info stored in R2 metadata
- Displayed in success message

**Automatic Notifications:**
- You get notified **instantly** when team uploads
- Email or webhook (Slack/Discord/etc.)
- Includes: version, uploader, file size, timestamp

---

## 🎯 Notification Example

When your team uploads, you'll receive:

```
Subject: 🚀 New SDIWare Release: v1.2.0

New SDIWare installer has been uploaded:

Version: 1.2.0
Uploaded by: John Doe
Filename: SDIWare-Installer.exe
Size: 487.23 MB
Date: January 10, 2025 at 2:30 PM CET

The new version is now live at: https://sdiware.video

---
This is an automated notification from the SDIWare upload system.
```

---

## 📧 Setup Email Notifications

### **Option 1: Simple Logging (Default - Already Active)**

**Current status:** Notifications are logged to Netlify function logs

**To view:**
1. Go to Netlify Dashboard
2. Click on your site
3. Go to "Logs" → "Functions"
4. Look for entries from `admin-upload`

**No setup needed** - this works now!

---

### **Option 2: Webhook (Slack, Discord, Teams, etc.)**

**Best for:** Team collaboration tools

#### **For Slack:**

1. **Create Slack Webhook:**
   - Go to https://api.slack.com/apps
   - Create new app → "Incoming Webhooks"
   - Activate Incoming Webhooks
   - "Add New Webhook to Workspace"
   - Select channel (e.g., #releases)
   - Copy webhook URL (looks like: `https://hooks.slack.com/services/...`)

2. **Add to Netlify:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add variable:
     - Key: `NOTIFICATION_WEBHOOK_URL`
     - Value: [Your Slack webhook URL]
   - Save and redeploy

**Done!** Next upload will post to Slack ✅

#### **For Discord:**

1. **Create Discord Webhook:**
   - Open Discord → Server Settings
   - Integrations → Webhooks → New Webhook
   - Name it "SDIWare Upload Bot"
   - Select channel
   - Copy Webhook URL

2. **Add to Netlify:**
   - Same as Slack above
   - Use `NOTIFICATION_WEBHOOK_URL` with Discord webhook

#### **For Microsoft Teams:**

1. **Create Teams Webhook:**
   - Teams channel → ⋯ → Connectors
   - Configure "Incoming Webhook"
   - Name: "SDIWare Uploads"
   - Copy URL

2. **Add to Netlify:**
   - Same as above

---

### **Option 3: Email via SendGrid (Professional)**

**Best for:** Email notifications to multiple people

#### **Setup:**

1. **Create SendGrid Account:**
   - Go to https://sendgrid.com (free tier: 100 emails/day)
   - Sign up / Log in
   - Create API Key:
     - Settings → API Keys → Create API Key
     - Full Access or Mail Send
     - Copy the API key

2. **Verify Sender Email:**
   - Settings → Sender Authentication
   - Verify your email address (e.g., info@sdiware.video)
   - Or verify domain: sdiware.video

3. **Add to Netlify Environment Variables:**
   ```
   SENDGRID_API_KEY = [your API key]
   NOTIFICATION_EMAIL = [your email to receive notifications]
   ```

4. **Redeploy site**

**Done!** You'll receive emails on every upload ✅

---

## 🔔 Multiple Notification Methods

**You can use ALL of them at once!**

- Logs (always active)
- Webhook → Slack channel
- Email → your inbox

Just set up multiple environment variables:
```
NOTIFICATION_WEBHOOK_URL = https://hooks.slack.com/...
SENDGRID_API_KEY = SG.abc123...
NOTIFICATION_EMAIL = your@email.com
```

---

## ⚙️ Environment Variables Summary

Add these to **Netlify Dashboard → Site Settings → Environment Variables:**

| Variable | Purpose | Required? |
|----------|---------|-----------|
| `NOTIFICATION_EMAIL` | Your email to receive notifications | Optional |
| `SENDGRID_API_KEY` | SendGrid API key for email | Optional (if using email) |
| `NOTIFICATION_WEBHOOK_URL` | Webhook URL (Slack/Discord/Teams) | Optional |

**Already configured:**
- `ADMIN_UPLOAD_SECRET` - Upload password ✅
- `R2_ENDPOINT` - R2 storage ✅
- `R2_ACCESS_KEY_ID` - R2 credentials ✅
- `R2_SECRET_ACCESS_KEY` - R2 credentials ✅

---

## 📋 What Information is Tracked

Every upload now captures:

1. **Version number** - e.g., "1.2.0" or "2025.01.10"
2. **Uploader name** - Who uploaded it
3. **Timestamp** - Exact date/time
4. **File size** - In MB
5. **Filename** - Usually "SDIWare-Installer.exe"

This info is:
- ✅ Stored in R2 file metadata
- ✅ Sent in notifications
- ✅ Logged to Netlify function logs
- ✅ Shown in upload success message

---

## 🧪 Testing Notifications

1. **Test with dummy upload:**
   - Go to https://sdiware.video/admin-upload.html
   - Version: "0.0.1-test"
   - Name: "Test User"
   - Upload any small .exe file

2. **Check results:**
   - Slack/Discord: Should see message in channel
   - Email: Check inbox
   - Logs: Netlify Dashboard → Logs → Functions

---

## 🎨 Customize Notification Format

**Want to change the notification message?**

Edit `/netlify/functions/admin-upload.js`:

```javascript
// Around line 35
const subject = `🚀 New SDIWare Release: v${version}`;
const body = `
New SDIWare installer has been uploaded:

Version: ${version}
Uploaded by: ${uploadedBy}
...
```

Change the text, add emojis, modify format as you like!

---

## 📊 Version History

**Want to track all versions uploaded?**

**Option 1: Check Netlify Logs**
- All uploads are logged with version info
- Netlify Dashboard → Logs → Functions

**Option 2: Add to Airtable** (Advanced)
- Modify `admin-upload.js` to write to Airtable
- Create "Version History" table
- Track: version, date, uploader, size, download count

**Option 3: Version Metadata File** (Advanced)
- Create `versions.json` in R2
- Append each upload to history
- Serve at https://sdiware.video/versions.json

---

## 🔐 Security Notes

- Webhook URLs are **secret** - don't share publicly
- SendGrid API keys are **sensitive** - keep in environment variables only
- Notification emails show version info - don't include sensitive data in version numbers

---

## ❓ FAQ

**Q: Will uploads fail if notifications fail?**
A: No! Notification failures are caught and logged, but won't stop the upload.

**Q: Can I notify multiple people?**
A: Yes!
- Webhook: Post to team channel (everyone sees)
- Email: Use a distribution list or add multiple recipients in SendGrid

**Q: Can I disable notifications?**
A: Yes, just don't set the environment variables. Logs will still work.

**Q: Can I customize per version (only notify for major releases)?**
A: Yes, modify the `sendNotification` function to check version format.

---

## 🚀 Quick Start (Recommended)

**Easiest setup for most teams:**

1. **Set up Slack webhook** (5 minutes)
   - Create webhook in Slack
   - Add `NOTIFICATION_WEBHOOK_URL` to Netlify
   - Redeploy

2. **Done!** Every upload posts to #releases channel

---

## 📞 Support

- Check Netlify function logs for errors
- Test webhooks manually: `curl -X POST [webhook-url] -d '{"text":"test"}'`
- SendGrid issues: Check sender verification

---

**Ready to get notifications?** Pick your method above and set it up!
