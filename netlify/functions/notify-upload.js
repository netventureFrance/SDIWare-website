const { S3Client, HeadObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');
const Airtable = require('airtable');

// Simple authentication
const UPLOAD_SECRET = process.env.ADMIN_UPLOAD_SECRET;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function sendEmailViaSendGrid(subject, body) {
  if (!SENDGRID_API_KEY) return;

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: NOTIFICATION_EMAIL,
    from: NOTIFICATION_EMAIL,
    subject: subject,
    text: body,
    trackingSettings: {
      clickTracking: {
        enable: false,
      },
    },
  };

  await sgMail.send(msg);
  console.log('Email notification sent via SendGrid');
}

// Generate download token
function generateToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Calculate expiration time (48 hours from now)
function getExpirationTime() {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  return expirationDate.toISOString();
}

// Send newsletter emails to all subscribers
async function sendNewsletterEmails(version, sizeMB, changelog) {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping newsletter');
    return 0;
  }

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);

  // Query Airtable for all subscribers (Newsletter = true)
  const subscribers = await base(process.env.AIRTABLE_TABLE_NAME)
    .select({
      filterByFormula: '{Newsletter} = 1',
      fields: ['Full Name', 'Email', 'Download Token', 'Token Expiration']
    })
    .all();

  console.log(`Found ${subscribers.length} newsletter subscribers`);

  if (subscribers.length === 0) {
    return 0;
  }

  // Send email to each subscriber and track recipients
  let sentCount = 0;
  const notifiedUsers = [];

  for (const record of subscribers) {
    try {
      const fullName = record.get('Full Name');
      const email = record.get('Email');
      const company = record.get('Company') || 'N/A';

      // Generate fresh download token for this version
      const downloadToken = generateToken();
      const expirationTime = getExpirationTime();

      // Update Airtable record with new token
      await base(process.env.AIRTABLE_TABLE_NAME).update(record.id, {
        'Download Token': downloadToken,
        'Token Expiration': expirationTime,
      });

      // Send newsletter email
      const downloadUrl = `https://sdiware.video/.netlify/functions/download/${downloadToken}`;

      const subject = `🎉 New SDIWare Version Available: v${version}`;
      const body = `
Dear ${fullName},

Great news! A new version of SDIWare is now available.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆕 New Version Available
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Version: ${version}
Size: ${sizeMB} MB

🔗 Download Link:
${downloadUrl}

⚠️ This download link expires in 48 hours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ What's New in v${version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${changelog}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your 30-day trial continues - this is just an update to the latest version.

If you have any questions, contact us at info@sdiware.video

Best regards,
The SDIWare Team

netventure r&d SRL
Via della Consolata 1bis
I-10122 Torino, Italia

---
To stop receiving update notifications, please reply to this email.
      `.trim();

      const msg = {
        to: email,
        from: {
          email: 'info@sdiware.video',
          name: 'SDIWare Team'
        },
        replyTo: 'info@sdiware.video',
        subject: subject,
        text: body,
        trackingSettings: {
          clickTracking: {
            enable: false,
          },
        },
      };

      await sgMail.send(msg);
      sentCount++;

      // Track successful send
      notifiedUsers.push({
        name: fullName,
        email: email,
        company: company,
      });

      console.log(`Newsletter sent to: ${email}`);

    } catch (emailError) {
      console.error(`Failed to send newsletter to ${record.get('Email')}:`, emailError);
      // Continue with other subscribers
    }
  }

  // Send summary email to support team
  if (notifiedUsers.length > 0) {
    await sendSupportSummary(version, notifiedUsers);
  }

  return { count: sentCount, users: notifiedUsers };
}

// Save upload record to Upload History table
async function saveUploadHistory(version, uploadedBy, sizeMB, changelog, newsletterCount, notifiedUsers) {
  try {
    // Build recipients list
    let recipientsList = '';
    notifiedUsers.forEach((user, index) => {
      recipientsList += `${index + 1}. ${user.name} (${user.email}) - ${user.company}\n`;
    });

    const uploadDate = new Date().toISOString();

    // Create record in Upload History table
    await base('Upload History').create({
      'Version': version,
      'Uploaded By': uploadedBy,
      'Upload Date': uploadDate,
      'File Size (MB)': parseFloat(sizeMB),
      'Changelog': changelog,
      'Newsletter Sent': newsletterCount > 0,
      'Recipients Count': newsletterCount,
      'Recipients List': recipientsList.trim(),
    });

    console.log('Upload history saved:', version);
  } catch (error) {
    console.error('Failed to save upload history:', error.message);
    console.log('Note: Make sure "Upload History" table exists in Airtable with these fields:');
    console.log('- Version (Single line text)');
    console.log('- Uploaded By (Single line text)');
    console.log('- Upload Date (Date & time)');
    console.log('- File Size (MB) (Number)');
    console.log('- Changelog (Long text)');
    console.log('- Newsletter Sent (Checkbox)');
    console.log('- Recipients Count (Number)');
    console.log('- Recipients List (Long text)');
    // Don't throw - this is optional logging
  }
}

// Send summary email to support team
async function sendSupportSummary(version, notifiedUsers) {
  if (!SENDGRID_API_KEY || !NOTIFICATION_EMAIL) {
    return;
  }

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);

  // Build user list
  let userList = '';
  notifiedUsers.forEach((user, index) => {
    userList += `${index + 1}. ${user.name}\n`;
    userList += `   Email: ${user.email}\n`;
    userList += `   Company: ${user.company}\n\n`;
  });

  const subject = `📧 Newsletter Sent: v${version} - ${notifiedUsers.length} Users Notified`;
  const body = `
Newsletter Distribution Report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Version: ${version}
Total Recipients: ${notifiedUsers.length}
Sent: ${new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following users have been notified about the new version:

${userList}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each user received:
- Direct download link (48-hour expiry)
- Version number: ${version}
- Fresh download token

You can track downloads in Airtable under "Last Downloaded Version" field.

---
This is an automated report from the SDIWare newsletter system.
  `.trim();

  const msg = {
    to: NOTIFICATION_EMAIL,
    from: {
      email: 'info@sdiware.video',
      name: 'SDIWare System'
    },
    replyTo: 'info@sdiware.video',
    subject: subject,
    text: body,
    trackingSettings: {
      clickTracking: {
        enable: false,
      },
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Support summary email sent to:', NOTIFICATION_EMAIL);
  } catch (error) {
    console.error('Failed to send support summary email:', error);
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { secret, version, uploadedBy, filename, changelog } = data;

    // Validate authentication
    if (secret !== UPLOAD_SECRET) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid authentication' }),
      };
    }

    // Get file info from R2 to confirm upload
    const headCommand = new HeadObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
    });

    const response = await r2Client.send(headCommand);
    const sizeMB = (response.ContentLength / 1024 / 1024).toFixed(2);
    const lastModified = response.LastModified.toISOString();
    const lastModifiedAge = Date.now() - new Date(lastModified).getTime();

    console.log('Upload confirmed:', version, sizeMB, 'MB');
    console.log('File last modified:', lastModified);
    console.log('File age (seconds):', Math.floor(lastModifiedAge / 1000));

    // Check if file was recently modified (within last 60 seconds)
    if (lastModifiedAge > 60000) {
      console.warn('WARNING: File was last modified more than 60 seconds ago!');
      console.warn('This suggests the upload may not have actually replaced the file.');
      console.warn('Expected upload time: just now, Actual last modified:', lastModified);
    }

    // Update metadata (copy object to itself with new metadata)
    const timestamp = new Date().toISOString();
    const copyCommand = new CopyObjectCommand({
      Bucket: 'sdiware',
      CopySource: 'sdiware/SDIWare-Installer.exe',
      Key: 'SDIWare-Installer.exe',
      Metadata: {
        'version': version,
        'uploaded-by': uploadedBy,
        'upload-date': timestamp,
        'size-mb': sizeMB,
      },
      MetadataDirective: 'REPLACE',
    });

    await r2Client.send(copyCommand);
    console.log('Metadata updated with version:', version);

    // Send notification email
    if (NOTIFICATION_EMAIL) {
      const uploadDate = new Date(lastModified).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });

      const subject = `🚀 New SDIWare Release: v${version}`;
      const body = `
New SDIWare installer has been uploaded:

Version: ${version}
Uploaded by: ${uploadedBy}
Filename: ${filename}
Size: ${sizeMB} MB
Date: ${uploadDate}

The new version is now live at: https://sdiware.video

---
This is an automated notification from the SDIWare upload system.
      `.trim();

      await sendEmailViaSendGrid(subject, body);
    }

    // Send newsletter emails to all subscribers
    let newsletterCount = 0;
    let notifiedUsers = [];

    try {
      const result = await sendNewsletterEmails(version, sizeMB, changelog || 'No changelog provided');
      newsletterCount = result.count;
      notifiedUsers = result.users;
      console.log(`Newsletter sent to ${newsletterCount} subscribers`);
    } catch (newsletterError) {
      console.error('Failed to send newsletter emails:', newsletterError);
      // Continue anyway - admin was notified
    }

    // Save upload history to Airtable (optional - won't fail if table doesn't exist)
    try {
      await saveUploadHistory(version, uploadedBy, sizeMB, changelog || 'No changelog provided', newsletterCount, notifiedUsers);
    } catch (historyError) {
      console.error('Failed to save upload history:', historyError);
      // Continue anyway - this is optional logging
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Upload confirmed and notification sent',
        version: version,
        sizeMB: sizeMB,
      }),
    };

  } catch (error) {
    console.error('Error in notification:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Notification failed: ' + error.message }),
    };
  }
};
