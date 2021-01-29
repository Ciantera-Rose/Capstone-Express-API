const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyD0PnlpGVjyjUx6vVTPjJCKU5v3quab7ic";

async function getCoordinates(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "No location found for the specified address",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordinates;

// Take address and have google API convert to coordinates