const { S3Client, HeadObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');

// Simple authentication
const UPLOAD_SECRET = process.env.ADMIN_UPLOAD_SECRET;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

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
    const { secret, version, uploadedBy, filename } = data;

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
