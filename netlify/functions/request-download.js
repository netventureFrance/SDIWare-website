const Airtable = require('airtable');
const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// Configure R2 Client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Generate a unique token for the download link
function generateToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Calculate expiration time (48 hours from now)
function getExpirationTime() {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  return expirationDate.toISOString();
}

// Get current version from R2
async function getCurrentVersion() {
  try {
    const command = new HeadObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
    });

    const response = await r2Client.send(command);
    const version = response.Metadata?.version || 'Latest';
    const uploadDate = response.Metadata?.['upload-date'] || null;

    return { version, uploadDate };
  } catch (error) {
    console.error('Error fetching version from R2:', error);
    return { version: 'Latest', uploadDate: null };
  }
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Enable CORS
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

  try {
    // Parse request body
    const data = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'company', 'useCase', 'gdprConsent'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Missing required field: ${field}` }),
        };
      }
    }

    // Validate GDPR consent
    if (data.gdprConsent !== true && data.gdprConsent !== 'true') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'GDPR consent is required' }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' }),
      };
    }

    // Generate unique download token
    const downloadToken = generateToken();
    const expirationTime = getExpirationTime();

    // Get current version from R2
    const { version, uploadDate } = await getCurrentVersion();

    console.log('Current version:', version);

    // Create record in Airtable
    const record = await base(process.env.AIRTABLE_TABLE_NAME).create({
      'Full Name': data.fullName,
      'Email': data.email,
      'Company': data.company,
      'Role': data.role || '',
      'Use Case': data.useCase,
      'GDPR Consent': data.gdprConsent === true || data.gdprConsent === 'true',
      'Newsletter': data.newsletter === true || data.newsletter === 'true',
      'Download Token': downloadToken,
      'Token Expiration': expirationTime,
      'Status': 'Pending',
      'Request Date': new Date().toISOString(),
      'IP Address': event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'Unknown',
      'User Agent': event.headers['user-agent'] || 'Unknown',
      'Version': version,
    });

    console.log('Download request created:', record.id);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Download request submitted successfully. Check your email for the download link.',
        recordId: record.id,
      }),
    };

  } catch (error) {
    console.error('Error processing download request:', error);

    // Check if it's an Airtable error
    if (error.statusCode) {
      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          error: 'Error communicating with database. Please try again later.',
          details: error.message
        }),
      };
    }

    // Generic error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'An unexpected error occurred. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};
