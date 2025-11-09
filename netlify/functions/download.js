const Airtable = require('airtable');

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// File URL on FastComet
const FILE_URL = 'https://www.sdiware.video/info/SDIWare%20Bundle.2.0.291.exe';

exports.handler = async (event, context) => {
  // Extract token from URL path
  // URL will be: /.netlify/functions/download/TOKEN
  const pathParts = event.path.split('/');
  const token = pathParts[pathParts.length - 1];

  console.log('Download request for token:', token);

  if (!token || token === 'download') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html' },
      body: generateErrorPage('Invalid download link. Please request a new download link.'),
    };
  }

  try {
    // Search for record with this token
    const records = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `{Download Token} = "${token}"`,
        maxRecords: 1,
      })
      .firstPage();

    // Check if record exists
    if (!records || records.length === 0) {
      console.log('Token not found:', token);
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: generateErrorPage('Invalid download link. This link does not exist.'),
      };
    }

    const record = records[0];
    const expirationDate = new Date(record.get('Token Expiration'));
    const currentDate = new Date();
    const status = record.get('Status');

    console.log('Record found:', record.id);
    console.log('Status:', status);
    console.log('Expiration:', expirationDate);
    console.log('Current:', currentDate);

    // Check if token is expired
    if (currentDate > expirationDate) {
      console.log('Token expired');

      // Update status to Expired
      await base(process.env.AIRTABLE_TABLE_NAME).update(record.id, {
        Status: 'Expired',
      });

      return {
        statusCode: 410,
        headers: { 'Content-Type': 'text/html' },
        body: generateErrorPage(
          'Download link expired. This link was valid for 48 hours and has now expired. Please request a new download link.',
          true
        ),
      };
    }

    // Check if already downloaded (optional - remove if you want to allow multiple downloads)
    if (status === 'Downloaded') {
      console.log('Already downloaded');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: generateSuccessPage(
          'This download link has already been used. Your download should start automatically. If not, click the button below.',
          FILE_URL
        ),
      };
    }

    // Check if status is valid
    if (status !== 'Pending' && status !== 'Sent') {
      console.log('Invalid status:', status);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: generateErrorPage('This download link is no longer valid.'),
      };
    }

    // Update status to Downloaded
    await base(process.env.AIRTABLE_TABLE_NAME).update(record.id, {
      Status: 'Downloaded',
    });

    console.log('Download authorized, redirecting to file');

    // Return success page with auto-download
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: generateSuccessPage(
        'Your download is starting... If the download doesn\'t start automatically, click the button below.',
        FILE_URL
      ),
    };

  } catch (error) {
    console.error('Error processing download:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: generateErrorPage('An error occurred. Please try again later or contact support.'),
    };
  }
};

function generateErrorPage(message, expired = false) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Error - SDIWare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
        }
        h1 {
            color: #ff4500;
            font-size: 1.75rem;
            margin-bottom: 1rem;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: #00d4aa;
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-family: inherit;
        }
        .btn:hover {
            background: #00b894;
            transform: translateY(-2px);
        }
        button.btn {
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">${expired ? '⏰' : '❌'}</div>
        <h1>${expired ? 'Link Expired' : 'Download Error'}</h1>
        <p>${message}</p>
        ${expired ? '<a href="https://www.sdiware.video/#download" class="btn">Request New Download Link</a>' : '<a href="https://www.sdiware.video" class="btn">Back to SDIWare</a>'}
    </div>
</body>
</html>
  `;
}

function generateSuccessPage(message, downloadUrl) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download SDIWare</title>
    <meta http-equiv="refresh" content="2;url=${downloadUrl}">
    <script>
        // Start download after 2 seconds
        setTimeout(function() {
            window.location.href = '${downloadUrl}';
        }, 2000);

        // Attempt to close window after 5 seconds (only works if opened via window.open)
        setTimeout(function() {
            // Show close message
            document.getElementById('message').innerHTML = 'Download started! You can close this tab now.';
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('closeBtn').style.display = 'inline-block';

            // Try to auto-close (may not work in all browsers)
            window.close();
        }, 5000);

        function closeWindow() {
            window.close();
            // If window.close() doesn't work, show message
            setTimeout(function() {
                alert('Please close this tab manually using your browser\\'s close button.');
            }, 500);
        }
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #3d4f5c 0%, #2d3e4a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .container {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        h1 {
            color: #00d4aa;
            font-size: 1.75rem;
            margin-bottom: 1rem;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: #00d4aa;
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-family: inherit;
        }
        .btn:hover {
            background: #00b894;
            transform: translateY(-2px);
        }
        button.btn {
            margin-top: 1rem;
        }
        .spinner {
            margin: 2rem auto;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #00d4aa;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📦</div>
        <h1>Download Ready!</h1>
        <p id="message">${message}</p>
        <div id="spinner" class="spinner"></div>
        <a href="${downloadUrl}" class="btn">Download SDIWare</a>
        <button id="closeBtn" onclick="closeWindow()" class="btn" style="display: none; margin-left: 1rem; background: #ff4500;">Close Tab</button>
        <p style="margin-top: 2rem; font-size: 0.875rem; color: #999;">
            Thank you for choosing SDIWare!
        </p>
    </div>
</body>
</html>
  `;
}
