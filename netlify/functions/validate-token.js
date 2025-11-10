const Airtable = require('airtable');

// Configure Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Get token from query parameter
  const token = event.queryStringParameters?.token;

  if (!token) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Token is required' }),
    };
  }

  console.log('Validating token:', token);

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
      console.log('Token not found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ valid: false, error: 'Invalid token' }),
      };
    }

    const record = records[0];
    const expirationDate = new Date(record.get('Token Expiration'));
    const currentDate = new Date();
    const status = record.get('Status');

    console.log('Record found:', record.id);
    console.log('Status:', status);
    console.log('Expiration:', expirationDate);

    // Check if token is expired
    if (currentDate > expirationDate) {
      console.log('Token expired');

      // Update status to Expired
      await base(process.env.AIRTABLE_TABLE_NAME).update(record.id, {
        Status: 'Expired',
      });

      return {
        statusCode: 410,
        headers,
        body: JSON.stringify({ valid: false, error: 'Token expired' }),
      };
    }

    // Check if status is valid
    if (status !== 'Pending' && status !== 'Sent' && status !== 'Downloaded') {
      console.log('Invalid status:', status);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ valid: false, error: 'Invalid status' }),
      };
    }

    // Token is valid
    console.log('Token is valid');

    // Update status to Downloaded if not already
    if (status !== 'Downloaded') {
      await base(process.env.AIRTABLE_TABLE_NAME).update(record.id, {
        Status: 'Downloaded',
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        email: record.get('Email'),
        company: record.get('Company')
      }),
    };

  } catch (error) {
    console.error('Error validating token:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ valid: false, error: 'Internal server error' }),
    };
  }
};
