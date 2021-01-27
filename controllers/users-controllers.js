const MOCK_USERS = [
  {
    id: "u1",
    name: "Ciantera Rose",
    // email: "fake@gmail.com"
    // password: "testpswd"
  },
  {
    id: "u2",
    name: "Kevin Castillo",
    // email: "fake@gmail.com"
    // password: "testpswd"
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: MOCK_USERS });
};

// const sigup = (req, res, next) => {};

// const login = (req, res, next) => {};

exports.getUsers = getUsers;
