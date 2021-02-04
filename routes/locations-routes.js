const { Router } = require("express");
const { check } = require("express-validator");

const locationsControllers = require("../controllers/locations-controllers");
const fileUpload = require("../middleware/file-upload");
const authCheck = require("../middleware/auth-check");

const router = Router();

router.get("/:lid", locationsControllers.getLocationById);

router.get("/user/:uid", locationsControllers.getLocationsByUserId);

router.use(authCheck);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  locationsControllers.newLocation
);

router.patch(
  "/:lid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 6 })],
  locationsControllers.updateLocation
);

router.delete("/:lid", locationsControllers.deleteLocation);

module.exports = router;
