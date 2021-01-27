const express = require("express");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

// create Auth system
// router.post("/signup", );

// router.post("/login");

module.exports = router;
