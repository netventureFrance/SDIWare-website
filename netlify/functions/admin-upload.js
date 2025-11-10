const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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
async function sendNotification({ version, uploadedBy, timestamp, filename, sizeMB }) {
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

  try {
    if (SENDGRID_API_KEY) {
      // Use SendGrid if configured
      await sendEmailViaSendGrid(subject, body);
    } else {
      // Use Netlify Functions built-in email (if available) or log
      console.log('Notification:', subject);
      console.log(body);

      // You could also use a webhook here to Slack, Discord, etc.
      await sendWebhookNotification(subject, body);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
    // Don't fail the upload if notification fails
  }
}

async function sendEmailViaSendGrid(subject, body) {
  if (!SENDGRID_API_KEY) return;

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: NOTIFICATION_EMAIL,
    from: NOTIFICATION_EMAIL, // Must be verified in SendGrid
    subject: subject,
    text: body,
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

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Extract password, version, and file
    const secret = parts.find(p => p.name === 'secret')?.data.toString();
    const version = parts.find(p => p.name === 'version')?.data.toString() || 'unversioned';
    const uploadedBy = parts.find(p => p.name === 'uploadedBy')?.data.toString() || 'Unknown';
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

    // Send notification email (if configured)
    await sendNotification({
      version,
      uploadedBy,
      timestamp,
      filename: filepart.filename,
      sizeMB,
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
