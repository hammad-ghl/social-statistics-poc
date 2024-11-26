async function fetchPlaylistItems({
  accessToken, // Required: OAuth 2.0 Access Token
  playlistId, // Required: The playlist ID to retrieve items for
  part = "snippet,contentDetails", // Parts to retrieve
  maxResults = 5, // Maximum number of results to return (default: 5, max: 50)
  pageToken = "", // Optional: Token to retrieve a specific page of results
}) {
  try {
    // Validate required parameters
    if (!accessToken) {
      throw new Error("accessToken is required");
    }
    if (!playlistId) {
      throw new Error("playlistId is required");
    }

    // Construct the query parameters
    const params = new URLSearchParams({
      part,
      playlistId,
      maxResults: maxResults.toString(),
    });

    if (pageToken) {
      params.append("pageToken", pageToken);
    }

    // Construct the full URL
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`;

    // Fetch playlist items
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching playlist items:", error.message);
    throw error;
  }
}

async function fetchChannelDetails({
  accessToken, // Required: OAuth 2.0 Access Token
  part = "snippet,contentDetails", // Parts to retrieve
  mine = true, // Fetch authenticated user's channel by default
}) {
  try {
    // Validate required parameters
    if (!accessToken) {
      throw new Error("accessToken is required");
    }

    // Construct the query parameters
    const params = new URLSearchParams({
      part,
      mine,
    });

    // Construct the full URL
    const url = `https://www.googleapis.com/youtube/v3/channels?${params.toString()}`;

    // Fetch channel details
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching channel details:", error.message);
    throw error;
  }
}

async function fetchYouTubeAnalyticsReports({
  startDate, // Required: Start date in 'YYYY-MM-DD' format
  endDate, // Required: End date in 'YYYY-MM-DD' format
  metrics, // Required: Comma-separated list of metrics to retrieve
  accessToken, // Required: OAuth 2.0 Access Token
  dimensions = "", // Optional: Comma-separated list of dimensions
  filters = "", // Optional: Filters to apply to the report
  maxResults = 200, // Optional: Maximum number of results to return
  sort = "", // Optional: Sorting parameters
  currency = "USD", // Optional: Currency for revenue-related metrics
}) {
  try {
    // Ensure required parameters are present
    if (!startDate || !endDate || !metrics || !accessToken) {
      throw new Error(
        "startDate, endDate, metrics, and accessToken are required parameters"
      );
    }

    // Construct the query parameters
    const params = new URLSearchParams({
      startDate,
      endDate,
      metrics,
      ids: "channel==MINE",
      maxResults,
      currency,
    });

    // Add optional parameters if provided
    if (dimensions) params.append("dimensions", dimensions);
    if (filters) params.append("filters", filters);
    if (sort) params.append("sort", sort);

    // Construct the full URL
    const url = `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`;

    // Fetch the data
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching YouTube Analytics:", error);
    throw error;
  }
}

const metrics = [
  "likes",
  "comments",
  "shares",
  "views",
  "subscribersGained",
  "subscribersLost",
  "averageViewDuration",
  "estimatedMinutesWatched",
];
// Example usage
async function exampleUsage(accessToken) {
  try {
    // const reportData = await fetchYouTubeAnalyticsReports({
    //   startDate: '2023-02-01',
    //   endDate: '2023-11-20',
    //   metrics: metrics.join(','),
    //   accessToken,
    //   dimensions: 'day',
    // //   filters: 'country==US'
    // });
    // console.log('Analytics Report:', reportData);

    const channelData = await fetchChannelDetails({ accessToken });
    console.log("Channel Report:");
    console.dir(channelData, { depth: 10 });

    const playlistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    console.log("🚀 ~ exampleUsage ~ playlistId:", playlistId);

    const uploads = await fetchPlaylistItems({ accessToken, playlistId });
    console.log("uploads Report:");
    console.dir(uploads, { depth: 10 });

    const nextPage = uploads.nextPageToken
    console.log("🚀 ~ exampleUsage ~ nextPage:", nextPage)
  } catch (error) {
    console.error("Failed to retrieve analytics:", error);
  }
}

// Export the functions
module.exports = {
  fetchYouTubeAnalyticsReports,
  exampleUsage,
};

// exampleUsage('ya29.a0AeDClZBq-i0ttLH6Wm-0LEdJ4oE4uf_rnH1nkS-ihqQWPBskGu6oym7S4ZpsxhJftmlLFES_QMnawyXMtA9Um_k75T4bSu3huY9e83NSMkiifQBo6c4XQOxLnkp13H5MSxwW2BeJHCBGpJ33AATMhQfC8jPZW5csNjDyUYkAnQaCgYKAWcSARASFQHGX2Mi9Vx5FIpTMQo2psmh4a_0MQ0177')
exampleUsage(
  ""
);

// Analytics Report: {
//     kind: 'youtubeAnalytics#resultTable',
//     columnHeaders: [
//       { name: 'day', columnType: 'DIMENSION', dataType: 'STRING' },
//       { name: 'views', columnType: 'METRIC', dataType: 'INTEGER' },
//       {
//         name: 'estimatedMinutesWatched',
//         columnType: 'METRIC',
//         dataType: 'INTEGER'
//       },
//       {
//         name: 'subscribersLost',
//         columnType: 'METRIC',
//         dataType: 'INTEGER'
//       },
//       { name: 'comments', columnType: 'METRIC', dataType: 'INTEGER' }
//     ],
//     rows: [
//       [ '2023-09-02', 5, 3, 0, 0 ],
//       [ '2023-09-05', 2, 1, 0, 0 ],
//       [ '2023-09-11', 1, 0, 0, 0 ],
//       [ '2023-09-13', 2, 0, 0, 0 ],
//       [ '2023-09-17', 1, 1, 0, 0 ],
//       [ '2023-09-20', 1, 0, 0, 0 ],
//       [ '2023-09-26', 1, 0, 0, 0 ],
//       [ '2023-10-07', 7, 6, 0, 0 ],
//       [ '2023-10-10', 1, 2, 0, 0 ],
//       [ '2023-10-27', 1, 0, 0, 0 ],
//       [ '2023-10-28', 1, 0, 0, 0 ],
//       [ '2023-10-29', 4, 5, 1, 0 ],
//       [ '2023-10-30', 1, 0, 0, 0 ],
//       [ '2023-10-31', 8, 4, 0, 0 ]
//     ]
//   }
