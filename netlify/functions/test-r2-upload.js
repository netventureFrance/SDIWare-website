const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Test 1: Check if we can read the file
    console.log('Test 1: Checking if file exists...');
    const headCommand = new HeadObjectCommand({
      Bucket: 'sdiware',
      Key: 'SDIWare-Installer.exe',
    });

    const headResponse = await r2Client.send(headCommand);
    const fileInfo = {
      size: headResponse.ContentLength,
      lastModified: headResponse.LastModified.toISOString(),
      metadata: headResponse.Metadata,
    };

    console.log('File info:', fileInfo);

    // Test 2: Try to upload a small test file
    console.log('Test 2: Attempting direct upload...');
    const testContent = `Test upload at ${new Date().toISOString()}`;
    const testKey = 'test-upload-' + Date.now() + '.txt';

    const putCommand = new PutObjectCommand({
      Bucket: 'sdiware',
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });

    await r2Client.send(putCommand);
    console.log('Test upload successful:', testKey);

    // Test 3: Verify test file was created
    const verifyCommand = new HeadObjectCommand({
      Bucket: 'sdiware',
      Key: testKey,
    });

    const verifyResponse = await r2Client.send(verifyCommand);
    console.log('Test file verified:', verifyResponse.ContentLength, 'bytes');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'R2 upload test successful',
        mainFile: fileInfo,
        testFile: {
          key: testKey,
          size: verifyResponse.ContentLength,
        },
      }),
    };

  } catch (error) {
    console.error('R2 test error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'R2 test failed',
        message: error.message,
        details: error.toString(),
      }),
    };
  }
};
