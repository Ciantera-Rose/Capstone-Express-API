const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const UserModel = require("../models/user-model");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await UserModel.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Unable to retreive users.", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input, please check you data", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup unsuccessful, please try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "An account for this user already exists, please login.",
      422
    );
    return next(error);
  }
  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const newUser = new UserModel({
    name,
    email,
    image: req.file.path,
    password: hashPassword,
    locations: [],
  });
  // TODO: Store password encrypted later
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login unsuccessful, please try again.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, please check and try again.",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged In",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
