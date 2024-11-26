// Enums
// DAILY_METRIC_UNKNOWN	                Represents the default unknown value.
// BUSINESS_IMPRESSIONS_DESKTOP_MAPS	Business impressions on Google Maps on Desktop devices. Multiple impressions by a unique user within a single day are counted as a single impression.
// BUSINESS_IMPRESSIONS_DESKTOP_SEARCH	Business impressions on Google Search on Desktop devices. Multiple impressions by a unique user within a single day are counted as a single impression.
// BUSINESS_IMPRESSIONS_MOBILE_MAPS	    Business impressions on Google Maps on Mobile devices. Multiple impressions by a unique user within a single day are counted as a single impression.
// BUSINESS_IMPRESSIONS_MOBILE_SEARCH	Business impressions on Google Search on Mobile devices. Multiple impressions by a unique user within a single day are counted as a single impression.
// BUSINESS_CONVERSATIONS	            The number of message conversations received on the business profile.
// BUSINESS_DIRECTION_REQUESTS	        The number of times a direction request was requested to the business location.
// CALL_CLICKS	                        The number of times the business profile call button was clicked.
// WEBSITE_CLICKS	                    The number of times the business profile website was clicked.
// BUSINESS_BOOKINGS	                The number of bookings made from the business profile via Reserve with Google.
// BUSINESS_FOOD_ORDERS	                The number of food orders received from the business profile.
// BUSINESS_FOOD_MENU_CLICKS	        The number of clicks to view or interact with the menu content on the business profile. Multiple clicks by a unique user within a single day are counted as 1.




async function fetchBusinessMetrics(accessToken, locationId) {
  const url = new URL(
    `https://businessprofileperformance.googleapis.com/v1/locations/${locationId}:fetchMultiDailyMetricsTimeSeries`
  );

  // Query parameters
  url.searchParams.append("dailyMetrics", "WEBSITE_CLICKS");
  url.searchParams.append("dailyMetrics", "CALL_CLICKS");
  url.searchParams.append("dailyRange.start_date.year", "2024");
  url.searchParams.append("dailyRange.start_date.month", "1");
  url.searchParams.append("dailyRange.start_date.day", "1");
  url.searchParams.append("dailyRange.end_date.year", "2024");
  url.searchParams.append("dailyRange.end_date.month", "2");
  url.searchParams.append("dailyRange.end_date.day", "28");

  try {

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        console.log("🚀 ~ fetchBusinessMetrics ~ response:", response.statusText ,response)
        throw new Error(`HTTP error! status: `, response);
        }
        
        const data = await response.json();
        console.dir(data, {depth: 15})

    // Process and log the metrics
    data.multiDailyMetricTimeSeries.forEach((metricSeries) => {
      metricSeries.dailyMetricTimeSeries.forEach((series) => {
        console.log("Metric:", series.dailyMetric);
        console.log("Time Series:", series.timeSeries);
      });
    });

    return data;
  } catch (error) {
    console.error("Error fetching business metrics:", error);
  console.log("🚀 ~ fetchBusinessMetrics ~ error:", error)
  }
}

// Usage example (you must replace with your actual access token and location ID)
const ACCESS_TOKEN =
  "";
const LOCATION_ID = "5342888273085967108";

fetchBusinessMetrics(ACCESS_TOKEN, LOCATION_ID);
