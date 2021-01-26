const express = require("express");

const locationsRoutes = require("./routes/locations-routes");

const app = express();

app.use("/api/locations", locationsRoutes);

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
