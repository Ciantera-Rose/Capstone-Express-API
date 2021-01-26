const express = require("express");

const router = express.Router();

const MOCK_LOCATIONS = [
  {
    id: "l1",
    title: "The Brooklyn Mirage",
    description:
      "The Brooklyn Mirage is a breathtaking open-air sanctuary in the heart of the Avant Gardner complex.",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/597a8b3920099e0bff668154/1538683215516-2O43UPWH0BHWLTGPF6DE/ke17ZwdGBToddI8pDm48kEZk6F5PbQiC1r1IZ2IoUeR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UfvbNRGeuxQFwQ8dTRP7_IjByFLq5tUM4qN8xXPNmdulg0wU7-gbCzcJVB_xdsPuSg/image-asset.jpeg",
    address: "140 Stewart Ave, Brooklyn, NY 11237",
    location: {
      lat: 40.7108803,
      lng: -73.9257375,
    },
    userId: "u1",
  },
  {
    id: "l2",
    title: "Output",
    description:
      "North Brooklyn's premier electronic and dance music venue that offers a more low-key experience than its bottle-service-heavy competitors, but still delivers heavy-hitting performers",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/06/25/b8/2d/output.jpg",
    address: "74 Wythe Ave, Brooklyn, NY 11249",
    location: {
      lat: 40.7222917,
      lng: -73.9578222,
    },
    userId: "u2",
  },
];

router.get("/:lid", (req, res, next) => {
  const locationId = req.params.lid;

  const location = MOCK_LOCATIONS.find((l) => {
    return l.id === locationId;
  });
  // console.log("GET request locations");
  if (!location) {
    return res.status(404).json({ message: "No location found for user" });
  }
  res.json({ location });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.userid;

  const location = MOCK_LOCATIONS.find((l) => {
    return l.user === userId;
  });

  if (!location) {
    return res.status(404).json({ message: "No location found for user" });
  }

  res.json({ location });
});

// get the user id and find the location of the user that has that id

// no location found returns 200 ok {} ... => create err => 404 (no data available)
// TODO: throw error handler if time

module.exports = router;
