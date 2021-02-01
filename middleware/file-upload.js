const multer = require("multer");

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: () => {},
    filename: () => {},
  }),
});

module.exports = fileUpload;
