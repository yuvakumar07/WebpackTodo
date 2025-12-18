require('dotenv').config();

let cachedToken = null;
let tokenExpiry = null;

async function getOAuthToken() {
  const currentTime = Date.now();

  if (cachedToken && tokenExpiry && currentTime < tokenExpiry) {
    console.log('Using cached OAuth token');
    return cachedToken;
  }

  console.log('Fetching new OAuth token...');

  try {
    const fetch = (await import('node-fetch')).default;

    const tokenUrl = process.env.OAUTH_TOKEN_URL;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;

    if (!tokenUrl || !clientId || !clientSecret) {
      throw new Error('OAuth credentials not configured in environment variables');
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth token request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    cachedToken = data.access_token;

    const expiresIn = data.expires_in || 3600;
    tokenExpiry = currentTime + (expiresIn * 1000) - 60000;

    console.log(`OAuth token fetched successfully, expires in ${expiresIn} seconds`);

    return cachedToken;
  } catch (error) {
    console.error('Error fetching OAuth token:', error.message);
    throw error;
  }
}

async function authMiddleware(req, res, next) {
  try {
    const token = await getOAuthToken();

    req.oauthToken = token;

    next();
  } catch (error) {
    console.error('Authentication failed:', error.message);
    return res.status(503).json({
      message: 'Authentication service unavailable',
      error: error.message
    });
  }
}

module.exports = authMiddleware;
