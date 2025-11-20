const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Airtable = require('airtable');

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// Simple authentication - set ADMIN_UPLOAD_SECRET in Netlify environment variables
const UPLOAD_SECRET = process.env.ADMIN_UPLOAD_SECRET;

// Email notification settings (optional)
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL; // Your email to receive notifications
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY; // Optional: SendGrid for emails

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Send notification when new version is uploaded
async function sendNotification({ version, uploadedBy, timestamp, filename, sizeMB, changelog }) {
  if (!NOTIFICATION_EMAIL) {
    console.log('No notification email configured, skipping notification');
    return;
  }

  const uploadDate = new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const subject = `🚀 New SDIWare Release: v${version}`;

  // Plain text version
  const textBody = `
New SDIWare installer has been uploaded:

Version: ${version}
Uploaded by: ${uploadedBy}
Filename: ${filename}
Size: ${sizeMB} MB
Date: ${uploadDate}

What's New:
${changelog}

The new version is now live at: https://sdiware.video

---
This is an automated notification from the SDIWare upload system.
  `.trim();

  // HTML version
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
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚀 New Upload</h1>
                            <p style="color: #00d4aa; margin: 10px 0 0 0; font-size: 18px;">SDIWare v${version}</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">A new version of SDIWare has been successfully uploaded to production.</p>

                            <!-- Details Box -->
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

                            <!-- Changelog -->
                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">✨ What's New</h2>
                            <div style="color: #666; font-size: 15px; line-height: 1.8; margin: 0 0 30px 0; white-space: pre-wrap; background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #00d4aa;">${changelog}</div>

                            <!-- Action Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://sdiware.video" style="display: inline-block; background-color: #00d4aa; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">View SDIWare Website</a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Success Message -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #155724; font-size: 14px;"><strong>✓ Upload Successful</strong><br>The new version is now live and available for download at sdiware.video</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
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

  try {
    if (SENDGRID_API_KEY) {
      // Use SendGrid if configured
      await sendEmailViaSendGrid(subject, textBody, htmlBody);
    } else {
      // Use Netlify Functions built-in email (if available) or log
      console.log('Notification:', subject);
      console.log(textBody);

      // You could also use a webhook here to Slack, Discord, etc.
      await sendWebhookNotification(subject, textBody);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
    // Don't fail the upload if notification fails
  }
}

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

async function sendWebhookNotification(subject, body) {
  const WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return; // No webhook configured
  }

  // Generic webhook format (works with Slack, Discord, etc.)
  const payload = {
    text: `${subject}\n\n${body}`,
    // For Slack
    username: 'SDIWare Upload Bot',
    icon_emoji: ':rocket:',
    // For Discord
    content: `${subject}\n\`\`\`\n${body}\n\`\`\``,
  };

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log('Webhook notification sent');
  } else {
    console.error('Webhook notification failed:', response.statusText);
  }
}

// Save upload record to Upload History table
async function saveUploadHistory(version, uploadedBy, sizeMB, changelog) {
  try {
    const uploadDate = new Date().toISOString();

    // Create record in Upload History table
    await base('Upload History').create({
      'Version': version,
      'Uploaded By': uploadedBy,
      'Upload Date': uploadDate,
      'File Size (MB)': parseFloat(sizeMB),
      'Changelog': changelog || 'No changelog provided',
      'Newsletter Sent': false,
      'Recipients Count': 0,
      'Recipients List': '',
    });

    console.log('Upload history saved:', version);
    return true;
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
    return false;
  }
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Check if upload secret is configured
  if (!UPLOAD_SECRET) {
    console.error('ADMIN_UPLOAD_SECRET not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Upload not configured' }),
    };
  }

  try {
    // Parse multipart form data from base64
    const boundary = event.headers['content-type'].split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid content type' }),
      };
    }

    // Decode base64 body
    const buffer = Buffer.from(event.body, 'base64');
    const parts = parseMultipart(buffer, boundary);

    // Extract password, version, changelog, and file
    const secret = parts.find(p => p.name === 'secret')?.data.toString();
    const version = parts.find(p => p.name === 'version')?.data.toString() || 'unversioned';
    const uploadedBy = parts.find(p => p.name === 'uploadedBy')?.data.toString() || 'Unknown';
    const changelog = parts.find(p => p.name === 'changelog')?.data.toString() || 'No changelog provided';
    const filepart = parts.find(p => p.name === 'installer');

    // Validate authentication
    if (secret !== UPLOAD_SECRET) {
      console.log('Invalid authentication attempt');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid authentication' }),
      };
    }

    // Validate file
    if (!filepart || !filepart.data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file uploaded' }),
      };
    }

    const timestamp = new Date().toISOString();
    const sizeMB = (filepart.data.length / 1024 / 1024).toFixed(2);

    console.log('Uploading file:', filepart.filename, 'Version:', version, 'Size:', filepart.data.length, 'By:', uploadedBy);

    // Upload to R2 with metadata
    const uploadCommand = new PutObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
      Body: filepart.data,
      ContentType: 'application/x-msdownload',
      Metadata: {
        'version': version,
        'uploaded-by': uploadedBy,
        'upload-date': timestamp,
        'size-mb': sizeMB,
      }
    });

    await r2Client.send(uploadCommand);

    console.log('Upload successful');

    // Save upload history to Airtable (optional - won't fail if table doesn't exist)
    try {
      await saveUploadHistory(version, uploadedBy, sizeMB, changelog);
    } catch (historyError) {
      console.error('Failed to save upload history:', historyError);
      // Continue anyway - upload was successful
    }

    // Send notification email (if configured)
    await sendNotification({
      version,
      uploadedBy,
      timestamp,
      filename: filepart.filename,
      sizeMB,
      changelog,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Upload successful!',
        filename: filepart.filename,
        version: version,
        size: filepart.data.length,
      }),
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Upload failed: ' + error.message }),
    };
  }
};

// Simple multipart parser
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from('--' + boundary);

  let start = 0;
  while (true) {
    const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
    if (boundaryIndex === -1) break;

    const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, boundaryIndex + boundaryBuffer.length);
    if (nextBoundaryIndex === -1) break;

    const partBuffer = buffer.slice(boundaryIndex + boundaryBuffer.length, nextBoundaryIndex);

    // Find headers end (double CRLF)
    const headersEnd = partBuffer.indexOf('\r\n\r\n');
    if (headersEnd === -1) {
      start = nextBoundaryIndex;
      continue;
    }

    const headersBuffer = partBuffer.slice(0, headersEnd);
    const dataBuffer = partBuffer.slice(headersEnd + 4, partBuffer.length - 2); // -2 for trailing CRLF

    // Parse Content-Disposition header
    const headers = headersBuffer.toString();
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);

    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch ? filenameMatch[1] : undefined,
        data: dataBuffer,
      });
    }

    start = nextBoundaryIndex;
  }

  return parts;
}
