const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordinates = require("../utility/location");
const LocationModel = require("../models/location-model");
const UserModel = require("../models/user-model");

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

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinates(address);
  } catch (error) {
    return next(error);
  }

  const createdLocation = new LocationModel({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    userId: req.userData.userId,
  });

  let user;
  try {
    user = await UserModel.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Failed to create new location, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Unable to locate user with provided id", 404);
    return next(error);
  }
  console.log(user);

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdLocation.save({ session: session });
    user.locations.push(createdLocation);
    await user.save({ session: session });
    await session.commitTransaction();

    // Transactions ... give id to locaiton of user
    // location will be created and user will be updated
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
    return next(new HttpError("Invalid input, please check you data", 422));
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
  if (location.userId !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to edit this location",
      401
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

const deleteLocation = async (req, res, next) => {
  const locationId = req.params.lid;

  let location;
  try {
    location = await LocationModel.findById(locationId).populate("userId");
  } catch (err) {
    const error = new HttpError(
      "Unable to delete location, please try again.",
      500
    );
    return next(error);
  }

  if (!location) {
    const error = new HttpError("No existing location for this user.");
    return next(error);
  }

  if (location.userId.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not authorized to delete this location",
      401
    );
    return next(error);
  }

  const imagePath = location.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await location.remove({ session: session });
    location.userId.locations.pull(location);
    await location.userId.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Unable to delete location, please try again.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Location has been deleted" });
};

exports.getLocationById = getLocationById;
exports.getLocationsByUserId = getLocationsByUserId;
exports.newLocation = newLocation;
exports.updateLocation = updateLocation;
exports.deleteLocation = deleteLocation;
