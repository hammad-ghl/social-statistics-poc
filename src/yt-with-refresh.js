const axios = require('axios');

async function refreshAccessToken(clientId, clientSecret, refreshToken) {
  console.log("🚀 ~ refreshAccessToken ~ refreshToken:", refreshToken)
  console.log("🚀 ~ refreshAccessToken ~ clientSecret:", clientSecret)
  console.log("🚀 ~ refreshAccessToken ~ clientId:", clientId)
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.response.data);
    // throw error;
  }
}

async function fetchYouTubeAnalyticsReports({
    startDate,           // Required: Start date in 'YYYY-MM-DD' format
    endDate,             // Required: End date in 'YYYY-MM-DD' format
    metrics,             // Required: Comma-separated list of metrics to retrieve
    accessToken,         // Required: OAuth 2.0 Access Token
    clientId = null,     // Optional: Client ID for token refresh
    clientSecret = null, // Optional: Client Secret for token refresh
    refreshToken = null, // Optional: Refresh Token for obtaining new access token
    dimensions = '',     // Optional: Comma-separated list of dimensions
    filters = '',        // Optional: Filters to apply to the report
    maxResults = 100,    // Optional: Maximum number of results to return
    sort = '',           // Optional: Sorting parameters
    currency = 'USD'     // Optional: Currency for revenue-related metrics
  }) {
    try {
      // Ensure required parameters are present
      if (!startDate || !endDate || !metrics || (!accessToken && !(clientId && clientSecret && refreshToken))) {
        throw new Error('Missing required parameters');
      }
  
      // Refresh token if needed
      let currentToken = accessToken;
      if (!currentToken && clientId && clientSecret && refreshToken) {
        currentToken = await refreshAccessToken(clientId, clientSecret, refreshToken);
      }
  
      // Construct the query parameters
      const params = new URLSearchParams({
        startDate,
        endDate,
        metrics,
        ids: 'channel==MINE',
        maxResults,
        currency
      });
  
      // Add optional parameters if provided
      if (dimensions) params.append('dimensions', dimensions);
      if (filters) params.append('filters', filters);
      if (sort) params.append('sort', sort);
  
      // Construct the full URL
      const url = `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`;
  
      // Fetch the data
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json'
        }
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorBody = await response.text();
        console.log("🚀 ~ errorBody:", errorBody)
        // throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
  
      // Parse and return the JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching YouTube Analytics:',);
      throw error;
  }
}

const metrics = [
    "comments",
    "views",
    "estimatedMinutesWatched"
];

// Example usage
async function exampleUsage() {
  try {
    const reportData = await fetchYouTubeAnalyticsReports({
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      metrics: metrics.join(','),
      clientId: '',
      clientSecret: '',
      refreshToken: '',
      dimensions: 'deviceType',
      filters: 'country==US'
    });

    console.log('Analytics Report:', reportData);
  } catch (error) {
    console.error('Failed to retrieve analytics:', error);
  }
}

module.exports = {
  fetchYouTubeAnalyticsReports,
  refreshAccessToken,
  exampleUsage
};

// If running directly
if (require.main === module) {
  exampleUsage();
}