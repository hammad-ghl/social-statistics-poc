// "dailyMetrics": [
//     {
//       "date": "2024-09-01",
//       "dataStatus": "READY",
//       "metrics": {
//         "VIDEO_AVG_WATCH_TIME": 5310.4064417177915,
//         "QUARTILE_95_PERCENT_VIEW": 180,
//         "SAVE": 6,
//         "ENGAGEMENT_RATE": 0.04751461988304093,
//         "PIN_CLICK": 58,
//         "OUTBOUND_CLICK_RATE": 0.0007309941520467836,
//         "VIDEO_MRC_VIEW": 422,
//         "VIDEO_10S_VIEW": 0,
//         "PIN_CLICK_RATE": 0.04239766081871345,
//         "IMPRESSION": 1368,
//         "SAVE_RATE": 0.0043859649122807015,
//         "ENGAGEMENT": 65,
//         "VIDEO_V50_WATCH_TIME": 3462385,
//         "VIDEO_START": 652,
//         "OUTBOUND_CLICK": 1
//       }
//     },

// Demographics - only for ads



const access_token = '';
const start_date = '2024-09-01';
const end_date = '2024-10-01';

async function fetchPinterestAnalytics({
    start_date,
    end_date,
    access_token,
    // Add optional parameters
    // metric_types = ['ENGAGEMENT', 'IMPRESSION', 'PIN_CLICK', 'OUTBOUND_CLICK', 'SAVE'],
    metric_types = null,
    granularity = 'DAY',
    ad_account_id = null
}) {
    try {
        // Construct query parameters
        const params = new URLSearchParams({
            start_date,
            end_date,
            granularity
        });

        // Add metric types if provided
        if (metric_types && metric_types.length > 0) {
            params.append('columns', metric_types.join(','));
        }

        // Determine the base URL
        let url = 'https://api.pinterest.com/v5/user_account/analytics';
        
        // If ad_account_id is provided, use ad account specific endpoint
        if (ad_account_id) {
            url = `https://api.pinterest.com/v5/ad_accounts/${ad_account_id}/analytics`;
        }

        // Append query parameters to URL
        url += `?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Check if response is successful
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();

        // Enhanced data processing
        return processAnalyticsData(data);

    } catch (error) {
        console.error('Error fetching Pinterest Analytics:', error);
        throw error;
    }
}

function processAnalyticsData(rawData) {
    // Check if data is empty or has no metrics
    if (!rawData || Object.keys(rawData).length === 0) {
        return {
            error: 'No data available',
            raw: rawData
        };
    }

    // Transform data to a more usable format
    const processedData = {
        summary: {},
        dailyMetrics: []
    };

    // Iterate through each property in the response
    Object.keys(rawData).forEach(property => {
        const propertyData = rawData[property];

        // Aggregate summary metrics
        if (propertyData.summary_metrics) {
            processedData.summary[property] = propertyData.summary_metrics;
        }

        // Process daily metrics
        if (propertyData.daily_metrics) {
            propertyData.daily_metrics.forEach(dailyMetric => {
                processedData.dailyMetrics.push({
                    date: dailyMetric.date,
                    dataStatus: dailyMetric.data_status,
                    metrics: dailyMetric.metrics || {}
                });
            });
        }
    });

    return processedData;
}

// Example usage
(async () => {
    try {
        const analyticsData = await fetchPinterestAnalytics({
            start_date,
            end_date,
            access_token,
            // Optional: specify more parameters
            metric_types: ['ENGAGEMENT', 'IMPRESSION', 'PIN_CLICK', 'SAVE']
        });

        console.log('Processed Analytics Data:', JSON.stringify(analyticsData, null, 2));
    } catch (error) {
        console.error('Failed to retrieve analytics:', error);
    }
})();

// Export for potential module use
