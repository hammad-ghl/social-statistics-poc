const axios = require('axios');

// TikTok API Endpoints
const TiktokOauthAPIEndpoint = 'https://open.tiktokapis.com/v2';
const TiktokBusinessAPIEndpoint = 'https://business-api.tiktok.com/open_api/v1.3';

// TikTok API Helper Methods
const TiktokApi = {
  getAccessTokenByRefreshToken: (body) =>
    axios.post(`${TiktokOauthAPIEndpoint}/oauth/token/`, new URLSearchParams(body).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
};

const TiktokBusinessApi = {
  getAccessTokenByRefreshToken: (body) =>
    axios.post(`${TiktokBusinessAPIEndpoint}/tt_user/oauth2/refresh_token/`, body, {
      headers: { 'Content-Type': 'application/json' },
    }),
};

/**
 * Get a refreshed access token for TikTok API.
 * @param {Object} oAuth - OAuth details stored in the database.
 * @param {Object} connectedAccount - Account details (type, ID, etc.).
 * @param {string} connectedAccount.type - Account type: BUSINESS or PERSONAL.
 * @returns {string} - Valid TikTok access token.
 */
async function getAccessToken(oAuth, connectedAccount) {
  if (!oAuth || !oAuth.refreshToken) {
    throw new Error('Invalid OAuth details provided.');
  }

  let accessToken;

  if (connectedAccount.type === 'BUSINESS') {
    // Refresh token for business accounts
    const { data } = await TiktokBusinessApi.getAccessTokenByRefreshToken({
      client_id: process.env.TIKTOK_BUSINESS_CLIENT_ID,
      client_secret: process.env.TIKTOK_BUSINESS_CLIENT_SECRET,
      refresh_token: oAuth.refreshToken,
      grant_type: 'refresh_token',
    });

    if (data?.data?.access_token) {
      accessToken = data.data.access_token;
      oAuth.accessToken = accessToken;
      await oAuth.save(); // Save updated token details to the database
    } else {
      throw new Error('Failed to refresh TikTok Business access token.');
    }
  } else {
    // Refresh token for personal accounts
    const { data } = await TiktokApi.getAccessTokenByRefreshToken({
      client_key: process.env.TIKTOK_CLIENT_ID,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      refresh_token: oAuth.refreshToken,
      grant_type: 'refresh_token',
    });

    if (data.access_token) {
      accessToken = data.access_token;
      oAuth.accessToken = accessToken;
      await oAuth.save(); // Save updated token details to the database
    } else {
      throw new Error('Failed to refresh TikTok access token.');
    }
  }

  return accessToken;
}

// Example Usage of Access Token Refresh
(async () => {
  try {
    // Assume `oAuth` and `connectedAccount` are fetched from your database
    const oAuth = { accessToken: null, refreshToken: 'YOUR_REFRESH_TOKEN', save: async () => {} };
    const connectedAccount = { type: 'BUSINESS' };

    // Get a valid access token
    const accessToken = await getAccessToken(oAuth, connectedAccount);

    console.log('Valid TikTok Access Token:', accessToken);

    // Proceed with your TikTok API requests using the refreshed `accessToken`
  } catch (error) {
    console.error('Error refreshing TikTok access token:', error.message);
  }
})();
