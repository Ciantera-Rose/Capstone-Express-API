const mongoose = require("mongoose");

const { Schema } = mongoose;

const userModelSchema = new Schema({
  password: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  locations: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Location-model",
    },
  ],
});

module.exports = mongoose.model("user-Model", userModelSchema);
