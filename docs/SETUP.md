# SDIWare Download System Setup Guide

This guide will walk you through setting up the download request system with Airtable and Netlify.

## Overview

The system works as follows:
1. User fills out the download form on the website
2. Form data is sent to a Netlify serverless function
3. Function creates a record in Airtable with a unique download token
4. Airtable automation sends an email to the user with the download link
5. Download link expires after 48 hours

## Prerequisites

- Airtable account (free tier works)
- Netlify account (free tier works)
- Git repository connected to Netlify

## Step 1: Set Up Airtable Base

### 1.1 Create a New Base

1. Go to [Airtable](https://airtable.com)
2. Click **"Add a base"** → **"Start from scratch"**
3. Name it: `SDIWare Downloads` (or your preferred name)

### 1.2 Create the Table

1. Rename the default table to: **"Download Requests"**
2. Add the following fields:

| Field Name | Field Type | Options |
|------------|------------|---------|
| Full Name | Single line text | - |
| Email | Email | - |
| Company | Single line text | - |
| Role | Single line text | - |
| Use Case | Single select | Options: "Live Studio Production", "Outside Broadcast / OB Van", "Corporate Events", "Remote/Cloud Production", "Other" |
| GDPR Consent | Checkbox | - |
| Newsletter | Checkbox | - |
| Download Token | Single line text | - |
| Token Expiration | Date | Include time |
| Status | Single select | Options: "Pending", "Sent", "Downloaded", "Expired" |
| Request Date | Date | Include time |
| IP Address | Single line text | - |
| User Agent | Long text | - |

### 1.3 Get Your Airtable Credentials

**Get API Key:**
1. Go to [https://airtable.com/account](https://airtable.com/account)
2. Scroll down to **"API"** section
3. Click **"Generate API key"** if you don't have one
4. Copy your API key

**Get Base ID:**
1. Go to [https://airtable.com/api](https://airtable.com/api)
2. Click on your **"SDIWare Downloads"** base
3. In the URL, you'll see something like: `https://airtable.com/appXXXXXXXXXXXXXX`
4. The `appXXXXXXXXXXXXXX` part is your Base ID

## Step 2: Create Airtable Automation for Email

### 2.1 Create the Automation

1. In your Airtable base, click **"Automations"** in the top menu
2. Click **"Create automation"**
3. Name it: **"Send Download Email"**

### 2.2 Configure Trigger

1. **Trigger:** "When record matches conditions"
2. **Table:** "Download Requests"
3. **Conditions:**
   - Status = "Pending"
   - Email is not empty
   - Download Token is not empty

### 2.3 Configure Action

1. **Action:** "Send email"
2. **To:** Use the dynamic field `Email`
3. **From name:** "SDIWare"
4. **Reply-to:** "info@sdiware.video"
5. **Subject:** `Your SDIWare Download Link (Valid for 48 Hours)`
6. **Message:** (Use the template below)

```
Hello {Full Name},

Thank you for your interest in SDIWare!

Your download link is ready and valid for the next 48 hours:

🔗 Download Link: https://www.sdiware.video/download/{Download Token}

Company: {Company}
Use Case: {Use Case}

⏰ This link will expire on: {Token Expiration}

If you have any questions or need assistance with the installation, please don't hesitate to contact us at info@sdiware.video.

Best regards,
The SDIWare Team

---
© 2025 netventure r&d SRL
Via della Consolata 1bis, I-10122 Torino, Italia
```

### 2.4 Add Status Update Action (Optional)

1. Add another action: **"Update record"**
2. **Record ID:** Use the dynamic Record ID from trigger
3. **Status:** Set to "Sent"

### 2.5 Test and Turn On

1. Click **"Test automation"** (create a test record first)
2. Once tested successfully, click **"Turn on automation"**

## Step 3: Configure Netlify

### 3.1 Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:

```
AIRTABLE_API_KEY = your_api_key_from_step_1.3
AIRTABLE_BASE_ID = your_base_id_from_step_1.3
AIRTABLE_TABLE_NAME = Download Requests
NODE_ENV = production
```

### 3.2 Deploy

1. Push your code to your Git repository
2. Netlify will automatically deploy
3. Your function will be available at: `https://your-site.netlify.app/.netlify/functions/request-download`

## Step 4: Test the System

### 4.1 Test the Form

1. Go to your website
2. Navigate to the Download section
3. Fill out the form with test data
4. Submit the form

### 4.2 Verify

1. **Check Airtable:** A new record should appear in your "Download Requests" table
2. **Check Email:** You should receive an email with the download link
3. **Check Netlify Logs:** Go to Netlify → Functions → request-download → View logs

## Step 5: Create the Download Handler

You'll need to create a system to handle the actual download when users click the link. This could be:

1. **Another Netlify Function:** Create `/.netlify/functions/download.js` that:
   - Verifies the token exists in Airtable
   - Checks if it's not expired (within 48 hours)
   - Validates status is "Sent" or "Pending"
   - Redirects to the actual file download URL
   - Updates status to "Downloaded"

2. **Cloud Storage:** Store your SDIWare installer on:
   - AWS S3
   - Google Cloud Storage
   - Dropbox
   - Or any file hosting service

## Troubleshooting

### Form Submission Fails

1. **Check Netlify Function Logs:**
   - Netlify Dashboard → Functions → request-download → View logs

2. **Common Issues:**
   - Incorrect Airtable API key
   - Wrong Base ID or Table Name
   - Missing environment variables

### Email Not Sending

1. **Check Airtable Automation:**
   - Ensure automation is turned on
   - Check automation run history
   - Verify email template has no syntax errors

2. **Check Record Status:**
   - Ensure Status field is set to "Pending" when record is created
   - Check that Email and Download Token fields are filled

### CORS Errors

1. Ensure your function includes CORS headers (already included in the code)
2. Check that you're calling the function from the same domain as your Netlify site

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env File

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials.

### 3. Run Netlify Dev

```bash
npm run dev
```

This will start a local server with Netlify Functions support.

## Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - All secrets are stored in Netlify
3. **Validate input** - The function already includes validation
4. **Rate limiting** - Consider adding rate limiting for production
5. **Token security** - Tokens are generated using cryptographically secure random bytes

## Support

For questions or issues:
- Email: info@sdiware.video
- Check Netlify function logs for errors
- Review Airtable automation run history

## Airtable Free Tier Limits

The free tier includes:
- 1,200 records per base
- 1,000 automation runs per month
- Unlimited bases

If you exceed these limits, consider upgrading to a paid plan.

## Next Steps

1. **Add Analytics:** Track downloads and conversions
2. **A/B Testing:** Test different form layouts
3. **Follow-up Automation:** Send reminder emails before link expires
4. **CRM Integration:** Sync contacts to your CRM
5. **Download Page:** Create a landing page for the download token URL

---

**© 2025 netventure r&d SRL**
