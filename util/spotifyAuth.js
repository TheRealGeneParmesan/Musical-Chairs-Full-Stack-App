const request = require("request");

const client_id = "e0d010b6e4d640b69c4daccfd94b38a8";
const client_secret = "94e849fb8cbf4b67aa43bff6a26456d0";

// Getting Spotify Authorization Token. Had to promisify to get token to refresh.

const spotAuth = () => {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "client_credentials",
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const token = body.access_token;
        resolve(token);
      } else {
        reject(error || body.error);
      }
    });
  });
};

module.exports = spotAuth;
