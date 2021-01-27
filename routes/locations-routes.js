const express = require("express");

const locationsControllers = require("../controllers/locations-controllers");

const router = express.Router();

router.get("/:lid", locationsControllers.getLocationById);

router.get("/user/:uid", locationsControllers.getLocationByUserId);

router.post("/", locationsControllers.newLocation);

router.patch("/:lid", locationsControllers.updateLocation);

router.delete("/:lid", locationsControllers.deleteLocation);

// get the user id and find the location of the user that has that id

// no location found returns 200 ok {} ... => create err => 404 (no data available)

module.exports = router;
