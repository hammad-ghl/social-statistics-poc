const moment = require("moment-timezone");

// Configuration object
const configs = {
  mkt: {
    id: "80847980",
    token:
      "",
  },
  hmd: {
    id: "105417991",
    token:
      "",
  },
  pastDays: 3, // Configurable number of past days
};

class LinkedinStatisticsService {
  constructor(configs, pastDays = 10, currentDayRef) {
    this.config = configs;
    this.pastDays = pastDays;
    this.currentDayRef = moment(currentDayRef);
  }

  getPastDaysTimeRange() {
    // Correct the calculation for the start and end dates
    const start = this.currentDayRef
      .clone()
      .subtract(this.pastDays, "days")
      .valueOf(); // Start of the day 'n' days ago

    const end = this.currentDayRef.clone().valueOf(); // Push end time slightly into the next day

    // Print human-readable dates for debugging
    console.log(
      `Readable Start Date: ${start} - ${moment(start)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss")} UTC`
    );
    console.log(
      `Readable End Date: ${end} - ${moment(end)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss")} UTC`
    );

    return { start, end };
  }

  // Generic fetch function for LinkedIn API
  async fetchLinkedInData(url, token, versionNumber, additionalHeaders = {}) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "LinkedIn-Version": versionNumber,
          "X-Restli-Protocol-Version": "2.0.0",
          ...additionalHeaders,
        },
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Error: ${response.status} ${response.statusText}\nDetails: ${errorBody}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }

  // Fetch LinkedIn Posts for an Author with Time Range
  async getLinkedInPosts(authorURN) {
    const encodedAuthorURN = encodeURIComponent(authorURN);
    const { start, end } = this.getPastDaysTimeRange(); // Get time range for the past configured days

    // const url = `https://api.linkedin.com/rest/posts?author=${encodedAuthorURN}&q=author&count=2&sortBy=CREATED`;
    // console.log(`Fetching Posts from: ${url}`);

    // return this.fetchLinkedInData(url, this.config.token, "202408", {
    //   "X-RestLi-Method": "FINDER",
    // });

    let url = `https://api.linkedin.com/rest/posts?author=${encodedAuthorURN}&q=author&count=100&sortBy=CREATED`;
  let postCountsByDay = {};
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await this.fetchLinkedInData(url, this.config.token, "202408", {
      "X-RestLi-Method": "FINDER",
    });

    if (response && response.elements) {
      for (const post of response.elements) {
        const postDate = moment.utc(post.createdAt);

        if (postDate.valueOf() < start) {
          // Stop processing if the post date is before the start date
          hasNextPage = false;
          break;
        }

        if (postDate.valueOf() <= end) {
          const dayKey = postDate.clone().startOf('day').toISOString(); // Key as start of the day in UTC

          // Increment count for the day
          if (!postCountsByDay[dayKey]) {
            postCountsByDay[dayKey] = 0;
          }
          postCountsByDay[dayKey]++;
        }
      }

      // Check for the next page
      const nextLink = response.paging?.links?.find(link => link.rel === 'next');
      if (nextLink) {
        url = `https://api.linkedin.com${nextLink.href}`;
      } else {
        hasNextPage = false;
      }
    } else {
      hasNextPage = false; // Stop if response structure is not as expected or no more posts
    }
  }

  return postCountsByDay;
  }

  // Fetch Organizational Entity Share Statistics
  async getOrganizationalEntityShareStatistics(organizationURN) {
    const { start, end } = this.getPastDaysTimeRange(); // Get time range for the past configured days
    const encodedOrganizationURN = encodeURIComponent(organizationURN);

    // Updated URL with nested timeIntervals structure
    const url = `https://api.linkedin.com/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodedOrganizationURN}&timeIntervals=(timeRange:(start:${start},end:${end}),timeGranularityType:DAY)`;

    console.log(`Fetching Share Statistics from: ${url}`);
    const response = await this.fetchLinkedInData(
      url,
      this.config.token,
      "202408"
    );

    // Populate response items with UTC start date
    if (response.elements) {
      response.elements.forEach((element) => {
        // Debug: Log the start time in milliseconds
        console.log(`Raw Start Time (ms): ${element.timeRange.start}`);

        // Convert the start time from milliseconds to a UTC date string
        const dayStart = moment.utc(element.timeRange.start).toISOString(); // Correctly convert to UTC
        console.log(`Calculated UTC Start Date: ${dayStart}`); // Debugging line

        element.utcStartDate = dayStart;
      });
    }

    return response;
  }

  // Fetch Organizational Entity Follower Statistics
  async getOrganizationalEntityFollowerStatistics(organizationURN) {
    const { start, end } = this.getPastDaysTimeRange(); // Get time range for the past configured days
    console.log(
      "🚀 ~ LinkedinStatisticsService ~ getOrganizationalEntityFollowerStatistics ~ end:",
      moment(end)
    );
    console.log(
      "🚀 ~ LinkedinStatisticsService ~ getOrganizationalEntityFollowerStatistics ~ start:",
      moment(start)
    );
    const encodedOrganizationURN = encodeURIComponent(organizationURN);

    // Updated URL with nested timeIntervals structure
    const url = `https://api.linkedin.com/rest/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=${encodedOrganizationURN}&timeIntervals=(timeRange:(start:${start},end:${end}),timeGranularityType:DAY)`;

    console.log(`Fetching Follower Statistics from: ${url}`);
    const response = await this.fetchLinkedInData(
      url,
      this.config.token,
      "202408"
    );

    // Populate response items with UTC start date
    if (response.elements) {
      response.elements.forEach((element) => {
        // Debug: Log the start time in milliseconds
        console.log(`Raw Start Time (ms): ${element.timeRange.start}`);

        // Convert the start time from milliseconds to a UTC date string
        const dayStart = moment.utc(element.timeRange.start).toISOString(); // Correctly convert to UTC
        console.log(`Calculated UTC Start Date: ${dayStart}`); // Debugging line

        element.utcStartDate = dayStart;
      });
    }

    return response;
  }

  // Main function to call all APIs
  async main() {
    const organizationURN = `urn:li:organization:${this.config.id}`;

    const posts = await this.getLinkedInPosts(organizationURN);
    console.log("LinkedIn Posts:");
    console.dir(posts, { depth: 99, colors: true });

    const shareStatistics = await this.getOrganizationalEntityShareStatistics(
      organizationURN
    );
    console.log("\n\nLinkedIn Share Statistics:");
    console.dir(shareStatistics, { depth: 99, colors: true });

    const followerStatistics =
      await this.getOrganizationalEntityFollowerStatistics(organizationURN);
    console.log("\n\nLinkedIn Follower Statistics:");
    console.dir(followerStatistics, { depth: 99, colors: true });
  }
}

// Instantiate and run the service
const currentDayRef = moment().utc().startOf("day").toISOString();
const linkedinService = new LinkedinStatisticsService(
  configs.hmd,
  configs.pastDays,
  currentDayRef
);
linkedinService.main();
