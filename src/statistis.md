# Tiktok
TikTok Account Stats: {
  code: 40001,
  message: 'No permission to operate tiktok creator id: 000iN264nCHRbbxNOwU1ppQUaiGi73fZza',
  request_id: '202411220612508BDB54FCE2791E65F3B0'
}
### Note:
- There seems to be something enabled in the account (users should enable insights in the tiktok app)
- Address this in error handling
- Add refresh token flow by default
- Tiktok tokens are short lived


-------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Youtube
- Add refresh token flow by default
- Youtube tokens are short lived


-------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Tiktok
- Constraints
    - needs to be a business account
    - Enable analytics in mobile app
- The data is displayed in UTC time zone and will need about 1-2 days to update.
- You will receive more insights about your viewers and the content they've engaged with once you have 100 followers. 


### API
- This endpoint has latency data for th endpoints - https://business-api.tiktok.com/portal/docs?id=1746624508278786#item-link-Reference%20table%20for%20data%20latency
- The data you can get from /business/get/ depends on whether you can see the corresponding TikTok Analytics data available in the app and at https://www.tiktok.com/analytics. If the corresponding metric data are missing from TikTok Analytics, you will not be able to get the data. To view insights and analytics data, TikTok account owners need to first publish at least one video, then tap the "Turn On" button on the Analytics page of their mobile TikTok app. For more information, refer to here.


-------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Google My Business (GMB)
The following are the metrics available for GMB

refer: 
https://developers.google.com/my-business/reference/performance/rest/v1/locations/fetchMultiDailyMetricsTimeSeries

 - DAILY_METRIC_UNKNOWN	                = Represents the default unknown value.
 - BUSINESS_IMPRESSIONS_DESKTOP_MAPS	= Business impressions on Google Maps on Desktop devices. Multiple impressions by a unique user within a single day are counted as a single impression.
 - BUSINESS_IMPRESSIONS_DESKTOP_SEARCH	= Business impressions on Google Search on Desktop devices. Multiple impressions by a unique user within a single day are counted as a single impression.
 - BUSINESS_IMPRESSIONS_MOBILE_MAPS	    = Business impressions on Google Maps on Mobile devices. Multiple impressions by a unique user within a single day are counted as a single impression.
 - BUSINESS_IMPRESSIONS_MOBILE_SEARCH	= Business impressions on Google Search on Mobile devices. Multiple impressions by a unique user within a single day are counted as a single impression.
 - BUSINESS_CONVERSATIONS	            = The number of message conversations received on the business profile.
 - BUSINESS_DIRECTION_REQUESTS	        = The number of times a direction request was requested to the business location.
 - CALL_CLICKS	                        = The number of times the business profile call button was clicked.
 - WEBSITE_CLICKS	                    = The number of times the business profile website was clicked.
 - BUSINESS_BOOKINGS	                = The number of bookings made from the business profile via Reserve with Google.
 - BUSINESS_FOOD_ORDERS	                = The number of food orders received from the business profile.
 - BUSINESS_FOOD_MENU_CLICKS	        = The number of clicks to view or interact with the menu content on the business profile. Multiple clicks by a unique user within a single day are counted as 1.