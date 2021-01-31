const mongoose = require("mongoose");

const { Schema } = mongoose;

const locationModelSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User-Model" },
});

module.exports = mongoose.model("Location-model", locationModelSchema);
