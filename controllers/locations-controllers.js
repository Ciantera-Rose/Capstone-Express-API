const uuid = require("uuid").v4;

let MOCK_LOCATIONS = [
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

const getLocationById = (req, res, next) => {
  const locationId = req.params.lid;

  const location = MOCK_LOCATIONS.find((l) => {
    return l.id === locationId;
  });

  if (!location) {
    const error = new Error("No location found for user");
    error.code = 404;
    return next(error);
  }
  res.json({ location });
};

const getLocationByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const location = MOCK_LOCATIONS.find((l) => {
    return l.userId === userId;
  });

  if (!location) {
    const error = new Error("No location found for user");
    error.code = 404;
    return next(error);
  }

  res.json({ location });
};

const newLocation = (req, res, next) => {
  const { title, description, coordinates, address, userId } = req.body;

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
  MOCK_LOCATIONS = MOCK_LOCATIONS.filter((l) => l.id !== locationId);
  res.status(200).json({ message: "Location has been deleted" });
};

exports.getLocationById = getLocationById;
exports.getLocationByUserId = getLocationByUserId;
exports.newLocation = newLocation;
exports.updateLocation = updateLocation;
exports.deleteLocation = deleteLocation;
