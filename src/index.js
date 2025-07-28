const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const BASE_URL =
  "https://api.pocketfm.com/v2/content_api/show.get_episodes?show_id=f629196ee7df34287ef2672e91fda9f939e9d02d&curr_ptr=";

app.get("/story-titles", async (req, res) => {
  try {
    let curr_ptr = parseInt(req.query.curr_ptr) || 0;
    let end_ptr = parseInt(req.query.end_ptr) || Infinity
    let allTitles = [];
    let hasMoreData = true;

    while (hasMoreData & curr_ptr < end_ptr) {
      const response = await axios.get(`${BASE_URL}${curr_ptr}`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "access-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImRldmljZV9pZCI6Im1vYmlsZS13ZWIiLCJleHBpcnkiOjE3NTM3NTY3NTIsImlhdCI6MTc1MzU4Mzk1MiwicGxhdGZvcm0iOiJ3ZWItMTdiMmMyNzVjMjc1YzI3NWNjZTNjMjc1Y2NlM2Y1MTc5MWMwZWJmYiIsInJvbGUiOiJMaXN0ZW5lciIsInRlbmFudCI6InBvY2tldF9mbSIsInVpZCI6IiIsInZlcnNpb24iOiJ2MiJ9.CAKhglviLelRoSv-5azKUCyLZT8anoyfo0HaZS7AGRw",
          "app-client": "consumer-web",
          "app-name": "pocket_fm",
          "app-version": 180,
          "auth-key": "17b2c275c275c275cce3c275cce3f51791c0ebfb",
          "auth-token": "web-auth",
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImRldmljZV9pZCI6Im1vYmlsZS13ZWIiLCJleHBpcnkiOjE3NTM3NTY3NTIsImlhdCI6MTc1MzU4Mzk1MiwicGxhdGZvcm0iOiJ3ZWItMTdiMmMyNzVjMjc1YzI3NWNjZTNjMjc1Y2NlM2Y1MTc5MWMwZWJmYiIsInJvbGUiOiJMaXN0ZW5lciIsInRlbmFudCI6InBvY2tldF9mbSIsInVpZCI6IiIsInZlcnNpb24iOiJ2MiJ9.CAKhglviLelRoSv-5azKUCyLZT8anoyfo0HaZS7AGRw",
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
        const titles = data.result.stories.map((story) => story.story_title);
        allTitles = allTitles.concat(titles);
        curr_ptr += 10;
      } else {
        hasMoreData = false;
      }
    }

    res.json(allTitles);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch story titles" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
