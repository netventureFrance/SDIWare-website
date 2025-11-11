# Complete Setup Guide - Step by Step

Follow this guide to set up everything from start to finish.

**What we'll set up:**
1. ✅ Email notifications when team uploads (via SendGrid)
2. ✅ Version field in Airtable
3. ✅ Professional download emails with version info
4. ✅ Test everything

**Time needed:** 20-30 minutes

---

## Part 1: SendGrid Email Notifications (Optional but Recommended)

This sends YOU an email when your team uploads a new version.

### **Step 1.1: Create SendGrid Account**

1. **Open browser** → https://sendgrid.com/en-us/pricing

2. **Click "Try for Free"**
   - Enter your email
   - Create password
   - Agree to terms
   - Click "Create Account"

3. **Verify your email**
   - Check inbox for verification email
   - Click verification link
   - Complete signup

4. **Skip onboarding questions** (or fill them in)
   - Click "Skip" or "Next" until you reach dashboard

**✅ You should now see SendGrid Dashboard**

---

### **Step 1.2: Create API Key**

1. **In SendGrid Dashboard**, click **Settings** (left sidebar, bottom)

2. Click **API Keys**

3. Click **"Create API Key"** button (top right)

4. **Configure API Key:**
   - API Key Name: `SDIWare Upload Notifications`
   - API Key Permissions: Select **"Full Access"**
     - Or select **"Restricted Access"** → Check only **"Mail Send"**

5. Click **"Create & View"**

6. **IMPORTANT: Copy the API key NOW**
   - It looks like: `SG.abc123def456ghi789...`
   - Click the copy icon
   - **Save it** in a text file temporarily (you'll need it soon)
   - You can ONLY see this once!

7. Click **"Done"**

**✅ API Key created and copied**

---

### **Step 1.3: Verify Sender Email**

SendGrid needs to verify the email address you'll send FROM.

1. **In SendGrid**, go to **Settings** → **Sender Authentication**

2. Click **"Get Started"** under **"Single Sender Verification"**

3. Click **"Create New Sender"**

4. **Fill in the form:**
   - From Name: `SDIWare Upload System`
   - From Email Address: `info@sdiware.video` (or your email)
   - Reply To: Same as above
   - Company Address: `Via della Consolata 1bis`
   - Company City: `Torino`
   - Company Country: `Italy`
   - Company Zip: `10122`
   - Nickname: `sdiware-notifications`

5. Click **"Create"**

6. **Check your email** (`info@sdiware.video`)
   - You'll receive "Verify Sender" email from SendGrid
   - Click **"Verify Single Sender"** button
   - Should see "Success!" message

7. **Back in SendGrid**, refresh the page
   - Status should show **"Verified"** ✅

**✅ Sender email verified**

---

### **Step 1.4: Add SendGrid to Netlify**

Now we'll add the API key to your website.

1. **Open new tab** → https://app.netlify.com

2. **Log in** to Netlify

3. **Click on your site** (sdiware-website or similar)

4. **Click "Site configuration"** (top tabs)

5. **Click "Environment variables"** (left sidebar)

6. **Add first variable:**
   - Click **"Add a variable"** or **"Add single variable"**
   - Key: `SENDGRID_API_KEY`
   - Value: [Paste the API key you copied] `SG.abc123...`
   - Scopes: Select **all** (Production, Deploy previews, Branch deploys)
   - Click **"Create variable"**

7. **Add second variable:**
   - Click **"Add a variable"** again
   - Key: `NOTIFICATION_EMAIL`
   - Value: `info@sdiware.video` (your email - where you want notifications)
   - Scopes: Select **all**
   - Click **"Create variable"**

**✅ You should now see both variables in the list:**
```
SENDGRID_API_KEY = •••••••••••• (hidden)
NOTIFICATION_EMAIL = info@sdiware.video
```

---

### **Step 1.5: Redeploy Site**

1. **In Netlify**, click **"Deploys"** tab (top)

2. Click **"Trigger deploy"** dropdown

3. Click **"Deploy site"**

4. **Wait 2-3 minutes** for deployment
   - You'll see the progress
   - Status will change from "Building" → "Published"

**✅ Site redeployed with email notifications enabled**

---

### **Step 1.6: Test Email Notifications (Optional)**

We'll test this after we upload a version later.

**For now, you're done with SendGrid setup!** ✅

---

## Part 2: Airtable Setup

Now let's set up Airtable to track versions and send professional emails.

### **Step 2.1: Add Version Field to Airtable**

1. **Open new tab** → https://airtable.com

2. **Log in** to Airtable

3. **Open your base** (the one with SDIWare downloads)

4. **Find your Downloads table**
   - Click on the table with download requests
   - Should have columns like: Full Name, Email, Company, Download Token, etc.

5. **Add new field:**
   - Click the **+** button (far right, next to last column)
   - Or click dropdown next to last column → "Insert right"

6. **Configure field:**
   - Field name: `Version`
   - Field type: **Single line text**
   - Click **"Create field"**

**✅ You should now see "Version" column in your table**

---

### **Step 2.2: Find Your Email Automation**

1. **In Airtable**, click **"Automations"** (top toolbar)
   - Look for robot icon 🤖

2. **Find your download email automation**
   - It might be called:
     - "Send download link"
     - "Email download link to user"
     - Or similar name
   - Click on it to open

3. **You should see:**
   - Trigger: "When record matches conditions" or "When record created"
   - Action: "Send email" or similar

**If you DON'T have an automation yet:**
- We'll create one in Step 2.3 below

**✅ Automation found (or ready to create)**

---

### **Step 2.3: Create Email Automation (If Needed)**

**Skip this if you already have one!**

If you don't have an automation yet:

1. Click **"Create automation"** button

2. **Configure trigger:**
   - Click "Add trigger"
   - Select: **"When record matches conditions"**
   - Table: [Your Downloads table]
   - Condition: `Status` `is` `Pending`
   - Click "Done"

3. **Add action:**
   - Click "Add action"
   - Select: **"Send email"**
   - Continue to Step 2.4 below

---

### **Step 2.4: Configure Email Action**

This is where we'll add the professional email template.

1. **In your email action**, you should see these fields:

#### **From:**
```
info@sdiware.video
```
(Or whatever email you use)

#### **To:**
```
{Email}
```
- Click in the field
- Select `Email` from the dropdown
- This pulls the email from each record

#### **Subject:**
```
Your SDIWare v{Version} Download is Ready! 🎉
```
- Type this exactly
- The `{Version}` will be replaced automatically

#### **Message:**

**Now we'll paste the email template. I'll give you the FULL template here:**

```
Dear {Full Name},

Thank you for choosing SDIWare! Your download link is now ready.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SDIWare v{Version} - Professional Broadcast Video Conversion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Download Link:
https://sdiware.video/.netlify/functions/download/{Download Token}

Version: {Version}
Trial Period: 30 days (from activation)
Link Valid For: 48 hours
Licensed To: {Full Name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Quick Start Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Click the download link above
2. Save the installer file (SDIWare-Installer.exe)
3. Run the installer and follow the setup wizard
4. Activate your 30-day trial when prompted

⚠️ IMPORTANT: Your download link expires in 48 hours from now. Please download the installer within this timeframe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ What's Included in v{Version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SDI/NDI/IP2110 conversion
✅ 4K HDR 10-bit support
✅ Alpha channel support
✅ Multi-channel audio
✅ Tally integration
✅ Program & Preview feeds
✅ CEF & WebRTC support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Need Help?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email Support: info@sdiware.video
🌐 Website: https://sdiware.video
📄 Documentation: https://sdiware.video/docs
💼 Your Use Case: {Use Case}

We're here to help you get the most out of SDIWare!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
The SDIWare Team

netventure r&d SRL
Via della Consolata 1bis
I-10122 Torino, Italia

---
This is an automated email. Your 30-day trial begins when you activate the software.
The download link expires 48 hours from receipt of this email.
For support, please reply to this email or contact info@sdiware.video
```

**Copy the template above and paste it into the Message field.**

2. **Click "Done"** or **"Save"**

**✅ Email template configured**

---

### **Step 2.5: Test the Automation**

1. **In the automation editor**, look for **"Test"** button (top right)

2. Click **"Test"**

3. **Select a record** to test with:
   - Choose any existing record from your table
   - Or create a test record first

4. **Run test**
   - Click "Run test" or "Send test"
   - Check if any errors appear

5. **Check your email:**
   - Go to your inbox
   - Look for the test email
   - Verify:
     - Subject shows version
     - All `{Fields}` are replaced with real data
     - Download link is present
     - Formatting looks good

**If email looks good:**
6. Click **"Turn on"** (toggle at top)
   - Automation is now ACTIVE ✅

**If there are errors:**
- Check that all field names match exactly
- Make sure `Version` field exists in table
- Verify `{Download Token}` field name is correct

**✅ Automation tested and activated**

---

## Part 3: Test the Complete System

Now let's test everything end-to-end!

### **Step 3.1: Test Upload Portal**

1. **Open browser** → https://sdiware.video/admin-upload.html

2. **Fill in the form:**
   - Version Number: `1.0.0-test`
   - Your Name: `Test User`
   - Upload Password: `[your password]`
   - File: Choose any small .exe file
     - Or create a dummy .exe file
     - Or use any file (for testing)

3. **Click "Upload to R2"**

4. **Confirm** when asked

5. **Wait for upload**
   - Should show progress
   - Should say "Upload successful!"

6. **Check your email (SendGrid notification):**
   - You should receive: "🚀 New SDIWare Release: v1.0.0-test"
   - From: info@sdiware.video
   - Shows: Version, uploader, file size, date

**✅ Upload works, notification received**

---

### **Step 3.2: Test Website Version Display**

1. **Open browser** → https://sdiware.video/#download

2. **Scroll to download section**

3. **Look for:**
   ```
   Download SDIWare
   Request your 30-day trial (download link valid for 48 hours)
   Current Version: v1.0.0-test (Jan 10, 2025)
   ```

4. **If you see the version** → ✅ Working!

5. **If you don't see it:**
   - Wait 1-2 minutes (might be caching)
   - Refresh page (Cmd/Ctrl + R)
   - Check browser console for errors (F12)

**✅ Version displays on website**

---

### **Step 3.3: Test Download Request Flow**

1. **On same page**, scroll to download form

2. **Fill in form:**
   - Full Name: `Test User`
   - Email: `[your test email]`
   - Company: `Test Company`
   - Role: `Developer`
   - Use Case: `Live Studio Production`
   - Check GDPR checkbox

3. **Click "Request Download"**

4. **Should see:** "Download request submitted successfully"

5. **Check Airtable:**
   - Go to your Airtable base
   - Find the new record
   - Verify `Version` field shows: `1.0.0-test` ✅

6. **Check your email (Airtable automation):**
   - Should receive: "Your SDIWare v1.0.0-test Download is Ready! 🎉"
   - From: info@sdiware.video
   - Contains download link
   - Shows version number

7. **Click download link** (to verify it works)
   - Should redirect to download page
   - Should start downloading the test file

**✅ Complete flow working!**

---

## Part 4: Update Email Template for Team

Now that everything works, update the email you'll send to your R&D team.

### **Step 4.1: Send Team Email**

Use the template from `EMAIL-TEMPLATE.md`:

**Subject:** SDIWare Release Upload System - New Process

**Body:**

```
Hi Team,

We've set up a new system for uploading SDIWare installer releases.

🚀 Quick Start:

Portal: https://sdiware.video/admin-upload.html
Password: [INSERT YOUR PASSWORD]

Steps:
1. Go to the upload portal
2. Enter version number (e.g., 1.2.0 or 2025.01.10)
3. Enter your name
4. Enter the upload password
5. Select SDIWare-Installer.exe
6. Click "Upload to R2"
7. Done! ✅

The new version goes live immediately at https://sdiware.video
I'll be notified automatically when you upload.

Important:
- Each upload replaces the current version (goes live immediately)
- Test your build before uploading!
- Use version format: 1.2.0 or YYYY.MM.DD
- I'll receive notification with version info

Questions? Contact me.

Best,
[Your Name]
```

**Replace `[INSERT YOUR PASSWORD]`** with your actual `ADMIN_UPLOAD_SECRET`

---

## ✅ Complete Setup Checklist

Go through this checklist to make sure everything is done:

### **Part 1: Email Notifications**
- [ ] SendGrid account created
- [ ] API key created and saved
- [ ] Sender email verified
- [ ] `SENDGRID_API_KEY` added to Netlify
- [ ] `NOTIFICATION_EMAIL` added to Netlify
- [ ] Site redeployed in Netlify

### **Part 2: Airtable**
- [ ] `Version` field added to Airtable table
- [ ] Email automation found or created
- [ ] Email template pasted and configured
- [ ] Automation tested
- [ ] Automation turned ON

### **Part 3: Testing**
- [ ] Test upload completed
- [ ] Upload notification received (SendGrid)
- [ ] Version shows on website
- [ ] Download request tested
- [ ] Version appears in Airtable record
- [ ] Download email received (Airtable)
- [ ] Download link works

### **Part 4: Team Communication**
- [ ] Email template updated with password
- [ ] Email sent to R&D team

---

## 🎉 You're All Done!

**What you've set up:**

1. ✅ **Upload system** with version tracking
2. ✅ **Email notifications** when team uploads (SendGrid)
3. ✅ **Version display** on website
4. ✅ **Professional download emails** with version info (Airtable)
5. ✅ **Complete tracking** of all uploads and downloads

**Everything is automated** - you just need to:
- Monitor notifications when team uploads
- Respond to user support requests
- Check Airtable for download analytics

---

## 🆘 Troubleshooting

### **SendGrid emails not working?**

1. **Check spam folder**
2. **Verify sender email** in SendGrid dashboard
3. **Check Netlify function logs:**
   - Netlify → Logs → Functions
   - Look for "Email notification sent" or errors
4. **Verify API key** is correct in Netlify

### **Airtable automation not sending?**

1. **Check automation is ON** (toggle in Airtable)
2. **Test automation** manually
3. **Verify trigger condition** matches (Status = Pending)
4. **Check field names** match exactly (`{Version}`, `{Email}`, etc.)

### **Version not showing on website?**

1. **Wait 2-3 minutes** after upload
2. **Refresh page** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
3. **Check browser console** (F12) for errors
4. **Verify version was set** during upload

### **Download link not working?**

1. **Check token expiration** (48 hours)
2. **Verify R2 credentials** in Netlify env variables
3. **Check Netlify function logs** for errors

---

## 📞 Need Help?

If you get stuck on any step:

1. **Check which step** you're on
2. **Note the exact error message** (if any)
3. **Check Netlify logs** (Deploys → Function logs)
4. **Check Airtable automation** run history
5. **Let me know** and I can help debug!

---

**You're ready to go! 🚀**

Everything is set up and tested. Your team can now upload releases with version tracking, and users will receive professional download emails!
