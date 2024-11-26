const axios = require('axios');

// List of all supported fields/metrics
const TIKTOK_FIELDS = [
  "username",
  "display_name",
  "profile_image",
  "bio_description",
  "profile_deep_link",
  "is_verified",
  "following_count",
  "total_likes",
  "videos_count",
  "followers_count",
  "audience_countries",
  "audience_genders",
  "profile_views",
  "video_views",
  "likes",
  "comments",
  "shares",
  "audience_activity"
];

/**
 * Fetch TikTok account statistics for the past `x` days.
 * 
 * @param {string} accessToken - TikTok API access token.
 * @param {string} businessId - Unique business ID for the TikTok account.
 * @param {number} days - Number of past days to fetch data for.
 * @param {Array<string>} fields - List of fields to fetch. Defaults to all available fields.
 */
async function getTikTokAccountStats({
  accessToken,
  businessId,
  days = 7,
  fields = TIKTOK_FIELDS
}) {
  try {
    // Validate inputs
    if (!accessToken) throw new Error("Access token is required.");
    if (!businessId) throw new Error("Business ID is required.");

    // Calculate date range for the past `x` days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const startDateString = startDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const endDateString = endDate.toISOString().split('T')[0];     // Format: YYYY-MM-DD

    // Construct the API URL
    const url = `https://business-api.tiktok.com/open_api/v1.3/business/get/`;

    // Make the API call
    const response = await axios.get(url, {
      headers: {
        'Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      params: {
        business_id: businessId,
        start_date: startDateString,
        end_date: endDateString,
        fields: JSON.stringify(fields)
      }
    });

    // Return the response data
    console.log('TikTok Account Stats:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // API responded with an error
      console.error('API Error:', error.response.data);
      throw new Error(`TikTok API Error: ${error.response.data.message || 'Unknown error'}`);
    } else {
      // Other errors (network, etc.)
      console.error('Request Error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}



// Example usage
(async () => {
  try {
    console.log('hitting tiktok api')
    const stats = await getTikTokAccountStats({
      accessToken: "",
      businessId: '000CtQN59L3wQW9KRLnc69fW945loIqA7y',
      days: 7, // Fetch stats for the past 7 days
      fields: TIKTOK_FIELDS // Use all available fields
    });

    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.log("🚀 ~ error:", error)
    console.error('Error:', error.message);
  }
})();
