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

async function sendEmailViaSendGrid(subject, textBody, htmlBody) {
  if (!SENDGRID_API_KEY) return;

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: NOTIFICATION_EMAIL,
    from: {
      email: 'info@sdiware.video',
      name: 'SDIWare System'
    },
    replyTo: 'info@sdiware.video',
    subject: subject,
    text: textBody,
    html: htmlBody,
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
      fields: ['Full Name', 'Email', 'Company', 'Download Token', 'Token Expiration']
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

      const textBody = `
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

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New SDIWare Version</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 New Version Available</h1>
                            <p style="color: #00d4aa; margin: 10px 0 0 0; font-size: 18px;">SDIWare v${version}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullName},</p>
                            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Great news! A new version of SDIWare is now available for download.</p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Version:</strong> ${version}</p>
                                        <p style="margin: 0; color: #666; font-size: 14px;"><strong style="color: #333;">Size:</strong> ${sizeMB} MB</p>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${downloadUrl}" style="display: inline-block; background-color: #00d4aa; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);">Download Now</a>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px;">⚠️ This download link expires in 48 hours.</p>
                                    </td>
                                </tr>
                            </table>

                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">✨ What's New in v${version}</h2>
                            <div style="color: #666; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; white-space: pre-wrap; background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #00d4aa;">${changelog}</div>

                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 20px 0;">Your 30-day trial continues - this is just an update to the latest version.</p>

                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">If you have any questions, contact us at <a href="mailto:info@sdiware.video" style="color: #00d4aa; text-decoration: none;">info@sdiware.video</a></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #333; font-size: 15px; margin: 0 0 10px 0;">Best regards,<br><strong>The SDIWare Team</strong></p>
                            <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
                                netventure r&d SRL<br>
                                Via della Consolata 1bis<br>
                                I-10122 Torino, Italia
                            </p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="color: #999; font-size: 12px; margin: 0;">To stop receiving update notifications, please reply to this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `.trim();

      const msg = {
        to: email,
        from: {
          email: 'info@sdiware.video',
          name: 'SDIWare Team'
        },
        replyTo: 'info@sdiware.video',
        subject: subject,
        text: textBody,
        html: htmlBody,
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

  // Build user list for text
  let userListText = '';
  notifiedUsers.forEach((user, index) => {
    userListText += `${index + 1}. ${user.name}\n`;
    userListText += `   Email: ${user.email}\n`;
    userListText += `   Company: ${user.company}\n\n`;
  });

  // Build user list for HTML
  let userListHtml = '';
  notifiedUsers.forEach((user, index) => {
    userListHtml += `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">
        <p style="margin: 0 0 5px 0; color: #333; font-size: 15px; font-weight: 600;">${index + 1}. ${user.name}</p>
        <p style="margin: 0 0 3px 0; color: #666; font-size: 14px;">📧 ${user.email}</p>
        <p style="margin: 0; color: #666; font-size: 14px;">🏢 ${user.company}</p>
      </td>
    </tr>`;
  });

  const subject = `📧 Newsletter Sent: v${version} - ${notifiedUsers.length} Users Notified`;
  const sentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const textBody = `
Newsletter Distribution Report

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Version: ${version}
Total Recipients: ${notifiedUsers.length}
Sent: ${sentDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following users have been notified about the new version:

${userListText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each user received:
- Direct download link (48-hour expiry)
- Version number: ${version}
- Fresh download token

You can track downloads in Airtable under "Last Downloaded Version" field.

---
This is an automated report from the SDIWare newsletter system.
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter Distribution Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📧 Newsletter Report</h1>
                            <p style="color: #00d4aa; margin: 10px 0 0 0; font-size: 18px;">v${version} Distribution</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px; margin: 0 0 30px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #155724; font-size: 16px; font-weight: 600;">✓ Newsletter Distribution Complete</p>
                                        <p style="margin: 0 0 5px 0; color: #155724; font-size: 14px;"><strong>Version:</strong> ${version}</p>
                                        <p style="margin: 0 0 5px 0; color: #155724; font-size: 14px;"><strong>Total Recipients:</strong> ${notifiedUsers.length}</p>
                                        <p style="margin: 0; color: #155724; font-size: 14px;"><strong>Sent:</strong> ${sentDate}</p>
                                    </td>
                                </tr>
                            </table>

                            <h2 style="color: #333; font-size: 20px; margin: 0 0 15px 0;">Notified Users</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e9ecef; border-radius: 6px; overflow: hidden;">
                              ${userListHtml}
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin: 30px 0 0 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: 600;">Each user received:</p>
                                        <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                                            <li>Direct download link (48-hour expiry)</li>
                                            <li>Version number: ${version}</li>
                                            <li>Fresh download token</li>
                                        </ul>
                                        <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">You can track downloads in Airtable under "Last Downloaded Version" field.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                This is an automated report from the SDIWare newsletter system.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();

  const msg = {
    to: NOTIFICATION_EMAIL,
    from: {
      email: 'info@sdiware.video',
      name: 'SDIWare System'
    },
    replyTo: 'info@sdiware.video',
    subject: subject,
    text: textBody,
    html: htmlBody,
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

      const textBody = `
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

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New SDIWare Upload</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚀 New Upload</h1>
                            <p style="color: #00d4aa; margin: 10px 0 0 0; font-size: 18px;">SDIWare v${version}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">A new version of SDIWare has been successfully uploaded to production.</p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Version:</strong> ${version}</p>
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Uploaded By:</strong> ${uploadedBy}</p>
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Filename:</strong> ${filename}</p>
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Size:</strong> ${sizeMB} MB</p>
                                        <p style="margin: 0; color: #666; font-size: 14px;"><strong style="color: #333;">Date:</strong> ${uploadDate}</p>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://sdiware.video" style="display: inline-block; background-color: #00d4aa; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">View SDIWare Website</a>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #155724; font-size: 14px;"><strong>✓ Upload Successful</strong><br>The new version is now live and available for download.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                This is an automated notification from the SDIWare upload system.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `.trim();

      await sendEmailViaSendGrid(subject, textBody, htmlBody);
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
