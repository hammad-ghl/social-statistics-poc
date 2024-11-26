// Graph API docs: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/insights/#metrics

const axios = require("axios");

const SocialBaseURLs = {
  INSTAGRAM: "https://graph.facebook.com/",
  FACEBOOK: "https://graph.facebook.com/",
};

const config = {
  baseUrl: SocialBaseURLs.INSTAGRAM,
  version: "v20.0",
  accessToken:
    "",
  instagramAccountId: "17841467615352189",
};

const socialURIs = {
  metricsURI: (x) =>
    `/insights?metric=impressions,reach,likes,comments,shares,total_interactions,accounts_engaged&period=day&metric_type=total_value&since=${x.since}&until=${x.until}&access_token=${config.accessToken}`,
  followersCountURI: (x) => `/insights?metric=follower_count&period=day&since=${x.since}&until=${x.until}&access_token=${config.accessToken}`,
};

// Basic schema-like JS object template
const dailyMetricSchemaTemplate = {
  _id: "dummy_id_123", // Dummy ID
  locationId: "dummy_location_456", // Dummy location ID
  socialAccountId: "dummy_account_789", // Dummy social account ID
  platform: "instagram", // Platform name
  date: new Date(), // Will be replaced with actual date of the metric
  impressions: 0,
  reach: 0,
  followers: 0, // Followers not in current metrics, so defaulting to 0
  likes: 0,
  comments: 0,
  shares: 0,
  totalInteractions: 0,
  accountsEngaged: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Function to generate 'since' and 'until' timestamps for the past 'x' days
function generatePastXDaysUnixTime(x) {
  const days = [];
  for (let i = 1; i <= x; i++) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - i);

    const startOfDay = Math.floor(
      new Date(pastDate.setHours(0, 0, 0, 0)).getTime() / 1000
    );
    const endOfDay = Math.floor(
      new Date(pastDate.setHours(23, 59, 59, 999)).getTime() / 1000
    );
    const dayName = pastDate.toLocaleDateString("en-US", { weekday: "long" });

    days.push({
      since: startOfDay,
      until: endOfDay,
      day: dayName,
      date: new Date(pastDate), // Store the date for schema later
    });
  }
  return days;
}

// Function to generate API URL
function generateApiUrl(uri) {
  const { baseUrl, version, instagramAccountId } = config;
  return `${baseUrl}${version}/${instagramAccountId}${uri}`;
}

// Function to map response to schema-like object
function mapResponseToSchema(response, schemaTemplate, date) {
  const mappedDoc = { ...schemaTemplate };
  mappedDoc.date = date;

  // Map available metrics to the schema
  response.data.forEach((metric) => {
    const metricValue = metric?.total_value?.value || 0;

    switch (metric.name) {
      case "impressions":
        mappedDoc.impressions = metricValue;
        break;
      case "reach":
        mappedDoc.reach = metricValue;
        break;
      case "likes":
        mappedDoc.likes = metricValue;
        break;
      case "comments":
        mappedDoc.comments = metricValue;
        break;
      case "shares":
        mappedDoc.shares = metricValue;
        break;
      case "total_interactions":
        mappedDoc.totalInteractions = metricValue;
        break;
      case "accounts_engaged":
        mappedDoc.accountsEngaged = metricValue;
        break;
      default:
        // Handle cases for unrecognized metrics or those not used
        break;
    }
  });

  return mappedDoc;
}

// Function to fetch Instagram insights for the past 'x' days
async function fetchInstagramInsights({ auth, api, metrics }, x) {
  const days = generatePastXDaysUnixTime(x);

  const results = [];

  for (const day of days) {
    const { since, until, day: dayName, date } = day;

    //  for metrics
    const url = generateApiUrl(
      socialURIs.metricsURI({
        since,
        until,
      })
    );

    // for follower counts
    const url2 = generateApiUrl(
        socialURIs.followersCountURI({
          since,
          until,
        })
      );

    try {
      console.log(`\n\n[+] Calling API for ${dayName}...`);
      const response = await axios.get(url);
      const response2 = await axios.get(url2);
      console.log("🚀 ~ fetchInstagramInsights ~ response2:", response2.data.data[0].values)

      // Map the response data to the schema-like object
      const dailyMetricsDoc = mapResponseToSchema(
        response.data,
        dailyMetricSchemaTemplate,
        date
      );

      // Collect results (can be saved to DB later)
      results.push(dailyMetricsDoc);
    //   console.log(dailyMetricsDoc); // Log the constructed doc for each day
    } catch (error) {
      console.error(
        `[-] Error fetching data for ${dayName}:`,
        error.response?.data || error.message
      );
      break;
    }
  }

  // Return all collected documents`
  return results;
}

// Example usage
const numberOfDays = 7; // Fetch data for the past 'x' days
fetchInstagramInsights(config, numberOfDays).then((results) => {
  console.log("[+] All results fetched: ", results);
  // You can now manipulate 'results' as needed for testing
});
