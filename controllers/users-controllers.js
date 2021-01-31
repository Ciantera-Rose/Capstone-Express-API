const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const MOCK_USERS = [
  {
    id: "u1",
    name: "Ciantera Rose",
    email: "fake@gmail.com",
    password: "testpswd",
  },
  {
    id: "u2",
    name: "Kevin Castillo",
    email: "fake@gmail.com",
    password: "testpswd",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: MOCK_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid input, please check you data", 422);
  }
  const { name, email, password } = req.body;

  const existingUser = MOCK_USERS.find((u) => u.email === email);
  if (existingUser) {
    throw new HttpError("A user with this email already exisits.", 422);
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  MOCK_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const createdUser = MOCK_USERS.find((u) => u.email === email);
  if (!createdUser || createdUser.password !== password) {
    throw new HttpError("Credentials invalid, please try again.", 401);
  }

  res.json({ message: "Logged In" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
