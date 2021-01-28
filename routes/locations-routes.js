const { Router } = require("express");
const { check } = require("express-validator");

const locationsControllers = require("../controllers/locations-controllers");

const router = Router();

router.get("/:lid", locationsControllers.getLocationById);

router.get("/user/:uid", locationsControllers.getLocationsByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  locationsControllers.newLocation
);

router.patch(
  "/:lid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  locationsControllers.updateLocation
);

router.delete("/:lid", locationsControllers.deleteLocation);

// get the user id and find the location of the user that has that id

// no location found returns 200 ok {} ... => create err => 404 (no data available)

// express validator for valitation middeware requirements, check title is not empty, left to right
module.exports = router;
