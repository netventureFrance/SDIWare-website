const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Simple authentication
const UPLOAD_SECRET = process.env.ADMIN_UPLOAD_SECRET;

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

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

  if (!UPLOAD_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Upload not configured' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { secret, version, uploadedBy, changelog } = data;

    // Validate authentication
    if (secret !== UPLOAD_SECRET) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid authentication' }),
      };
    }

    // Validate required fields
    if (!version || !uploadedBy || !changelog) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing version, uploadedBy, or changelog' }),
      };
    }

    const timestamp = new Date().toISOString();

    // Create presigned URL for upload (valid for 1 hour)
    // NOTE: Do NOT include Metadata here - it causes signature mismatch
    // Metadata will be added later in notify-upload.js using CopyObjectCommand
    const command = new PutObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    console.log('Generated presigned upload URL for version:', version);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        uploadUrl: uploadUrl,
        version: version,
        uploadedBy: uploadedBy,
        timestamp: timestamp,
      }),
    };

  } catch (error) {
    console.error('Error generating upload URL:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate upload URL: ' + error.message }),
    };
  }
};
