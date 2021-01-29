const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const HttpError = require("../errors/http-error");
const getCoordinates = require("../utility/location");

let MOCK_LOCATIONS = [
  {
    id: "l1",
    title: "The Brooklyn Mirage",
    description:
      "The Brooklyn Mirage is a breathtaking open-air sanctuary in the heart of the Avant Gardner complex.",
    location: {
      lat: 40.7108803,
      lng: -73.9257375,
    },
    address: "140 Stewart Ave, Brooklyn, NY 11237",
    userId: "u1",
  },
  {
    id: "l2",
    title: "Output",
    description:
      "North Brooklyn's premier electronic and dance music venue that offers a more low-key experience than its bottle-service-heavy competitors, but still delivers heavy-hitting performers",
    location: {
      lat: 40.7222917,
      lng: -73.9578222,
    },
    address: "74 Wythe Ave, Brooklyn, NY 11249",
    userId: "u2",
  },
];

const getLocationById = (req, res, next) => {
  const locationId = req.params.lid;

  const location = MOCK_LOCATIONS.find((l) => {
    return l.id === locationId;
  });

  if (!location) {
    throw new HttpError("No location found for user", 404);
  }
  res.json({ location });
};

const getLocationsByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const locations = MOCK_LOCATIONS.filter((l) => {
    return l.userId === userId;
  });

  if (!locations || locations.length === 0) {
    new HttpError("No locations found for this user.", 404);
  }

  res.json({ locations });
};

const newLocation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check you data.", 422));
  }

  const { title, description, address, userId } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinates(address);
  } catch (error) {
    return next(error);
  }

  const createdLocation = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    userId,
  };

  MOCK_LOCATIONS.push(createdLocation);

  res.status(201).json({ location: createdLocation });
};

const updateLocation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid input, please check you data", 422);
  }
  const { title, description } = req.body;
  const locationId = req.params.lid;

  const updatedLocation = {
    ...MOCK_LOCATIONS.find((l) => l.id === locationId),
  };
  const locationIndex = MOCK_LOCATIONS.findIndex((l) => l.id === locationId);
  updatedLocation.title = title;
  updatedLocation.description = description;

  MOCK_LOCATIONS[locationIndex] = updatedLocation;

  res.status(200).json({ location: updatedLocation });
};

const deleteLocation = (req, res, next) => {
  const locationId = req.params.lid;

  if (!MOCK_LOCATIONS.find((l) => l.id === locationId)) {
    throw new HttpError("No location found for that user", 404);
  }
  MOCK_LOCATIONS = MOCK_LOCATIONS.filter((l) => l.id !== locationId);
  res.status(200).json({ message: "Location has been deleted" });
};

exports.getLocationById = getLocationById;
exports.getLocationsByUserId = getLocationsByUserId;
exports.newLocation = newLocation;
exports.updateLocation = updateLocation;
exports.deleteLocation = deleteLocation;

// search for address and get back coordinates. Google geocoding api
// Geocoding request and response (latitude/longitude lookup)
// Google Maps Platform => Get API again => AIzaSyD0PnlpGVjyjUx6vVTPjJCKU5v3quab7ic
