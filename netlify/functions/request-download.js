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

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SDIWare Download</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SDIWare v${version}</h1>
                            <p style="color: #00d4aa; margin: 10px 0 0 0; font-size: 16px;">Your Download is Ready!</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${fullName},</p>
                            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thank you for choosing SDIWare! Your download link is now ready.</p>

                            <!-- Download Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${downloadUrl}" style="display: inline-block; background-color: #00d4aa; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);">Download SDIWare</a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Version:</strong> ${version}</p>
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Trial Period:</strong> 30 days (from activation)</p>
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong style="color: #333;">Link Valid For:</strong> 48 hours</p>
                                        <p style="margin: 0; color: #666; font-size: 14px;"><strong style="color: #333;">Licensed To:</strong> ${fullName}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Quick Start -->
                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">🚀 Quick Start Guide</h2>
                            <ol style="color: #666; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                                <li>Click the download button above</li>
                                <li>Save the installer file (SDIWare-Installer.exe)</li>
                                <li>Run the installer and follow the setup wizard</li>
                                <li>Activate your 30-day trial when prompted</li>
                            </ol>

                            <!-- Warning -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px;"><strong>⚠️ IMPORTANT:</strong> Your download link expires in 48 hours from now. Please download the installer within this timeframe.</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Features -->
                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">✨ What's Included in v${version}</h2>
                            <ul style="color: #666; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                                <li>SDI/NDI/IP2110 conversion</li>
                                <li>4K HDR 10-bit support</li>
                                <li>Alpha channel support</li>
                                <li>Multi-channel audio</li>
                                <li>Tally integration</li>
                                <li>Program & Preview feeds</li>
                                <li>CEF & WebRTC support</li>
                            </ul>

                            <!-- Support -->
                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">💬 Need Help?</h2>
                            <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                                <strong style="color: #333;">Email Support:</strong> <a href="mailto:info@sdiware.video" style="color: #00d4aa; text-decoration: none;">info@sdiware.video</a>
                            </p>
                            <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                                <strong style="color: #333;">Website:</strong> <a href="https://sdiware.video" style="color: #00d4aa; text-decoration: none;">sdiware.video</a>
                            </p>
                            <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0;">
                                <strong style="color: #333;">Your Use Case:</strong> ${useCase}
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #333; font-size: 15px; margin: 0 0 10px 0;">Best regards,<br><strong>The SDIWare Team</strong></p>
                            <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
                                netventure r&d SRL<br>
                                Via della Consolata 1bis<br>
                                I-10122 Torino, Italia
                            </p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
                                This is an automated email. Your 30-day trial begins when you activate the software.<br>
                                The download link expires 48 hours from receipt of this email.<br>
                                For support, please reply to this email or contact info@sdiware.video
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
    to: email,
    from: {
      email: 'info@sdiware.video',
      name: 'SDIWare Team'
    },
    replyTo: 'info@sdiware.video',
    subject: subject,
    text: textContent,
    html: htmlContent,
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
