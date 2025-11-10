const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Simple authentication - set ADMIN_UPLOAD_SECRET in Netlify environment variables
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

    // Extract password and file
    const secret = parts.find(p => p.name === 'secret')?.data.toString();
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

    console.log('Uploading file:', filepart.filename, 'Size:', filepart.data.length);

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
      Body: filepart.data,
      ContentType: 'application/x-msdownload',
    });

    await r2Client.send(uploadCommand);

    console.log('Upload successful');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Upload successful!',
        filename: filepart.filename,
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
