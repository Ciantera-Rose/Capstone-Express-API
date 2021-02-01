const multer = require("multer");
const uuid = require("uuid").v1;

const fileTypes = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {},
    filename: (req, file, cb) => {
      const extension = fileTypes[file.mimetype];
      cb(null, uuid() + "." + extension);
    },
  }),
});

module.exports = fileUpload;
