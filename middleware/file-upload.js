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
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const extension = fileTypes[file.mimetype];
      cb(null, uuid() + "." + extension);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!fileTypes[file.mimetype];
    let error = isValid ? null : new Error("Invalid file type");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
