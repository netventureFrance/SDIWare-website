const Airtable = require('airtable');
const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

// Send download email via SendGrid
async function sendDownloadEmail({ fullName, email, version, downloadToken, useCase }) {
  const downloadUrl = `https://sdiware.video/.netlify/functions/download/${downloadToken}`;

  const subject = `Your SDIWare v${version} Download is Ready! 🎉`;

  const textContent = `
Dear ${fullName},

Thank you for choosing SDIWare! Your download link is now ready.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SDIWare v${version} - Professional Broadcast Video Conversion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Download Link:
${downloadUrl}

Version: ${version}
Trial Period: 30 days (from activation)
Link Valid For: 48 hours
Licensed To: ${fullName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Quick Start Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Click the download link above
2. Save the installer file (SDIWare-Installer.exe)
3. Run the installer and follow the setup wizard
4. Activate your 30-day trial when prompted

⚠️ IMPORTANT: Your download link expires in 48 hours from now. Please download the installer within this timeframe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ What's Included in v${version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SDI/NDI/IP2110 conversion
✅ 4K HDR 10-bit support
✅ Alpha channel support
✅ Multi-channel audio
✅ Tally integration
✅ Program & Preview feeds
✅ CEF & WebRTC support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Need Help?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Email Support: info@sdiware.video
🌐 Website: https://sdiware.video
💼 Your Use Case: ${useCase}

We're here to help you get the most out of SDIWare!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
The SDIWare Team

netventure r&d SRL
Via della Consolata 1bis
I-10122 Torino, Italia

---
This is an automated email. Your 30-day trial begins when you activate the software.
The download link expires 48 hours from receipt of this email.
For support, please reply to this email or contact info@sdiware.video
  `.trim();

  const msg = {
    to: email,
    from: {
      email: 'info@sdiware.video',
      name: 'SDIWare Team'
    },
    replyTo: 'info@sdiware.video',
    subject: subject,
    text: textContent,
    trackingSettings: {
      clickTracking: {
        enable: false,
      },
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Download email sent via SendGrid to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    throw error;
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

    // Send download email via SendGrid
    try {
      await sendDownloadEmail({
        fullName: data.fullName,
        email: data.email,
        version: version,
        downloadToken: downloadToken,
        useCase: data.useCase,
      });
      console.log('Download email sent successfully to:', data.email);
    } catch (emailError) {
      console.error('Failed to send download email:', emailError);
      // Continue anyway - record is created, user can contact support
    }

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
