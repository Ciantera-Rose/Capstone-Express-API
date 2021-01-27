const express = require("express");
const bodyParser = require("body-parser");

const locationsRoutes = require("./routes/locations-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/locations", locationsRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

app.listen(5000);

// /api/locations/...
// Retrieve list of all locations for a given user id
// GET .../user/:uid

// Get a specific location by location id
// GET .../:lid

// Create a new location
// POST .../

// Update a location by id
// PATCH.../:lid

// Delete a location by id
// DELETE.../:lid

// err funct goes after routes middleware, takes 4 params, will execute requests with errors if routes middeware in front has erros
// if no response sent yet set status, set code on error obj thrown in routes
// show message in data obj. if mess on err obj or err
// throw err in routes or next().. (async in this case when db)
