const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordinates = require("../utility/location");
const LocationModel = require("../models/location-model");

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

const getLocationById = async (req, res, next) => {
  const locationId = req.params.lid;

  let location;
  try {
    location = await LocationModel.findById(locationId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find that location.",
      500
    );
    return next(error);
  }

  if (!location) {
    const error = new HttpError("No location found for user", 404);
    return next(error);
  }
  res.json({ location: location.toObject({ getters: true }) });
};

const getLocationsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let locations;
  try {
    locations = await LocationModel.find({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Failed to retrive locations, please try again.",
      500
    );
    return next(error);
  }

  if (!locations || locations.length === 0) {
    return next(new HttpError("No locations found for this user.", 404));
  }

  res.json({
    locations: locations.map((location) =>
      location.toObject({ getters: true })
    ),
  });
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
  // Match schema
  const createdLocation = new LocationModel({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://images.squarespace-cdn.com/content/v1/597a8b3920099e0bff668154/1538683215516-2O43UPWH0BHWLTGPF6DE/ke17ZwdGBToddI8pDm48kEZk6F5PbQiC1r1IZ2IoUeR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UfvbNRGeuxQFwQ8dTRP7_IjByFLq5tUM4qN8xXPNmdulg0wU7-gbCzcJVB_xdsPuSg/image-asset.jpeg",
    userId,
  });

  try {
    await createdLocation.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to create new location, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ location: createdLocation });
};

const updateLocation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid input, please check you data", 422);
  }
  const { title, description } = req.body;
  const locationId = req.params.lid;

  let location;
  try {
    location = await LocationModel.findById(locationId);
  } catch (err) {
    const error = new HttpError(
      "Failed to update location, please try again.",
      500
    );
    return next(error);
  }

  location.title = title;
  location.description = description;

  try {
    await location.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to update location, please try again.",
      500
    );
    return next(error);
  }
  res.status(200).json({ location: location.toObject({ getters: true }) });
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
