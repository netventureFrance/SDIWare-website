const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get metadata from R2 file
    const command = new HeadObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
    });

    const response = await r2Client.send(command);

    // Extract version info from metadata
    const version = response.Metadata?.version || 'Unknown';
    const uploadedBy = response.Metadata?.['uploaded-by'] || 'Unknown';
    const uploadDate = response.Metadata?.['upload-date'] || null;
    const sizeMB = response.Metadata?.['size-mb'] || null;

    // Get file info
    const contentLength = response.ContentLength;
    const lastModified = response.LastModified;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        version: version,
        uploadedBy: uploadedBy,
        uploadDate: uploadDate,
        sizeMB: sizeMB || (contentLength / 1024 / 1024).toFixed(2),
        lastModified: lastModified,
        fileSize: contentLength,
      }),
    };

  } catch (error) {
    console.error('Error fetching version:', error);

    // Return a default response if file not found or error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        version: 'Latest',
        uploadedBy: 'Unknown',
        uploadDate: null,
        sizeMB: null,
        lastModified: null,
        fileSize: null,
      }),
    };
  }
};
