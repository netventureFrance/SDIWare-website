# Airtable Version Field Setup

How to add version information to your Airtable download emails.

---

## 🎯 What's New

**Version tracking is now automatic:**
- Current version fetched from R2 when download is requested
- Version stored in Airtable record
- Can be included in email sent to users

---

## 📋 Setup Steps

### **Step 1: Add Version Field to Airtable**

1. **Go to your Airtable base**: https://airtable.com

2. **Find your Downloads table** (the one used for SDIWare downloads)

3. **Add new field:**
   - Click the **+** button to add a field
   - Field name: `Version`
   - Field type: **Single line text**
   - Click **Create field**

**Done!** The field will now be populated automatically when users request downloads.

---

### **Step 2: Update Email Automation (Include Version)**

Your Airtable automation sends emails when download requests come in. Let's add the version to those emails.

#### **Option A: Modify Existing Automation**

1. Go to **Automations** in Airtable

2. Find your download email automation (likely triggered when "Status" is "Pending")

3. Click on the **Send email** action

4. **Update the email template** to include version:

**Example email template:**

```
Subject: Your SDIWare Download Link (v{Version})

Dear {Full Name},

Thank you for your interest in SDIWare!

Your download link for SDIWare v{Version} is ready:
https://sdiware.video/.netlify/functions/download/{Download Token}

Version: {Version}
Trial Period: 30 days
Link Valid: 48 hours

Download Instructions:
1. Click the link above
2. Your download will start automatically
3. Run the installer and follow the setup wizard

Need help? Contact us at info@sdiware.video

Best regards,
SDIWare Team
```

**Key changes:**
- Added `(v{Version})` to subject line
- Added `Version: {Version}` in email body
- Changed to `v{Version}` in download link description

5. Click **Save**

---

#### **Option B: Better Email Template (Professional)**

```
Subject: 🎉 Your SDIWare v{Version} Download is Ready!

Dear {Full Name},

Thank you for choosing SDIWare! Your download link is ready.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SDIWare v{Version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Download Link:
https://sdiware.video/.netlify/functions/download/{Download Token}

✅ Trial Period: 30 days
⏰ Link Valid For: 48 hours
🆕 Version: {Version}
👤 Licensed To: {Full Name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Quick Start
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Click the download link above
2. Run the installer (SDIWare-Installer.exe)
3. Follow the setup wizard
4. Activate your 30-day trial

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Need Help?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email: info@sdiware.video
🌐 Website: https://sdiware.video
📄 Documentation: https://sdiware.video/docs

Best regards,
The SDIWare Team

---
This email was generated automatically. Your trial will expire 30 days after activation.
The download link expires in 48 hours from receipt of this email.
```

---

### **Step 3: Test the Setup**

1. **Request a download** from your website: https://sdiware.video/#download

2. **Check Airtable:**
   - New record should have `Version` field populated
   - Example: "1.2.0" or "Latest"

3. **Check Email:**
   - Email should show version in subject and body
   - Example: "Your SDIWare Download Link (v1.2.0)"

---

## 📧 Email Template Variables Available

You can use any of these fields in your Airtable email:

| Variable | Example | Description |
|----------|---------|-------------|
| `{Version}` | `1.2.0` | Current version being downloaded |
| `{Full Name}` | `John Doe` | User's name |
| `{Email}` | `john@example.com` | User's email |
| `{Company}` | `Acme Corp` | User's company |
| `{Download Token}` | `abc123...` | Unique download token |
| `{Token Expiration}` | `2025-01-12T14:30:00.000Z` | When link expires |
| `{Request Date}` | `2025-01-10T14:30:00.000Z` | When requested |
| `{Use Case}` | `Live Studio Production` | Selected use case |

---

## 🎨 Airtable Email Formatting Tips

**Bold text:**
```
**This is bold**
```

**Add spacing:**
```
Use blank lines for spacing


Like this
```

**Add emojis:**
```
🎉 🚀 ✅ ⏰ 📦 👤 💬 📧 🌐 📄
```

**Add links:**
```
Click here: https://sdiware.video
```

**Add line separators:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔍 Version Display on Website

The version is also displayed on the website download section:

```
Download SDIWare
Request your 30-day trial (download link valid for 48 hours)
Current Version: v1.2.0 (Jan 10, 2025)
```

This is automatically fetched from R2 and updated when page loads.

---

## 🆕 How Version Gets Set

**When team uploads new installer:**

1. Team member fills upload form:
   - Version: `1.2.0`
   - Name: `John Doe`
   - File: `SDIWare-Installer.exe`

2. Version stored in R2 metadata

3. **When user requests download:**
   - System fetches current version from R2
   - Adds to Airtable record
   - Included in email automatically

**Fully automated!** ✅

---

## 🧪 Testing Checklist

- [ ] Added `Version` field to Airtable table
- [ ] Updated email automation to include `{Version}`
- [ ] Tested: Request download from website
- [ ] Verified: Version appears in Airtable record
- [ ] Verified: Version appears in email
- [ ] Checked: Website shows current version

---

## ❓ FAQ

**Q: What if version shows "Latest" or "Unknown"?**

A: This happens if:
- No version has been uploaded yet via the upload portal
- The installer was uploaded manually (not via upload portal)

**Solution:** Upload next version via upload portal to set version metadata.

**Q: Can I manually set the version in Airtable?**

A: Yes, but it will be overwritten on the next download request. The version is automatically fetched from R2.

**Q: Can I show different versions to different users?**

A: Currently, all users get the current/latest version. For version-specific downloads, you'd need to implement version selection.

**Q: How do I change the version format?**

A: The format is set when team uploads (e.g., "1.2.0" or "2025.01.10"). Use any format that makes sense for your team.

---

## 🎯 Next Steps

1. **Add field to Airtable** (Step 1 above)
2. **Update email template** (Step 2 above)
3. **Test it** (Step 3 above)
4. **Upload a version** via upload portal to populate version metadata

---

## 📞 Support

If version isn't showing:
- Check Airtable field name is exactly: `Version`
- Check Netlify function logs for errors
- Verify R2 metadata has version info
- Test email automation manually in Airtable

---

**Ready to set this up?** Follow Step 1 and Step 2 above!
