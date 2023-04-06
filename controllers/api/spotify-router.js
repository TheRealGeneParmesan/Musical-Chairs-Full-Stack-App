const router = require("express").Router();
const spotAuth = require("../../util/spotifyAuth");

const axios = require("axios");

// Gets spotify authorization

router.get("/spotify-auth", (req, res) => {
  spotAuth(res);
});

// Allows to search a song

router.get("/search", async (req, res) => {
  const query = req.query.q;
  const type = "track";
  const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}`;
  console.log("url:", url);

  try {
    const accessToken = await spotAuth(res);
    console.log(accessToken);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const tracks = response.data.tracks.items;
    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// spotAuth();
module.exports = router;
