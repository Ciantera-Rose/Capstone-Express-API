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

module.exports = router;
