const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Function to construct the API URL
function getUrl(showId, currPtr) {
  return `https://api.pocketfm.com/v2/content_api/show.get_episodes?show_id=${showId}&curr_ptr=${currPtr}`;
}

// Endpoint to fetch titles
app.get("/show/:showId/episode", async (req, res) => {
  try {
    let curr_ptr = parseInt(req.query.curr_ptr) || 0;
    let end_ptr = parseInt(req.query.end_ptr) || Infinity;
    let token = req.query.token;
    let fields = req.query.fields ? req.query.fields.split(",") : [];

    let allTitles = [];
    let hasMoreData = true;

    while (hasMoreData && curr_ptr < end_ptr) {
      const url = getUrl(req.params.showId, curr_ptr); // Construct the URL with the current pointer
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "access-token": token,
          "app-client": "consumer-web",
          "app-name": "pocket_fm",
          "app-version": 180,
          "auth-key": "17b2c275c275c275cce3c275cce3f51791c0ebfb",
          "auth-token": "web-auth",
          authorization: `Bearer ${token}`,
          "device-id": "mobile-web",
          locale: "IN",
          origin: "https://pocketfm.com",
          platform: "web",
          priority: "u=1, i",
          "sec-ch-ua": `"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"`,
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "Android",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
        },
      });
      const data = response.data;

      if (data.status === 1 && data.result && data.result.stories) {
        const titles = data.result.stories.map((story) => {
          if (fields.length === 0) {
            return story.story_title; // Return only the title if no fields are selected
          }
          return fields.reduce((acc, field) => {
            acc[field] = story[field];
            return acc;
          }, {});
        });

        // If no fields are selected, ensure titles are unique
        if (fields.length === 0) {
          titles.forEach((title) => {
            if (!allTitles.includes(title)) {
              allTitles.push(title);
            }
          });
        } else {
          allTitles = allTitles.concat(titles);
        }

        curr_ptr += 10; // Increment the pointer for the next batch
      } else {
        hasMoreData = false; // Stop if no more data is available
      }
    }

    res.json(allTitles); // Send the collected titles as the response
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch story titles" });
  }
});

// Serve the HTML file on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
