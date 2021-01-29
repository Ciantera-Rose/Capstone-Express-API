const mongoose = require("mongoose");

const { Schema } = mongoose;

const locationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Location", locationSchema);
