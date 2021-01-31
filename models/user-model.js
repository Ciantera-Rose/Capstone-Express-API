const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const userModelSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  locations: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Location-Model",
    },
  ],
});

userModelSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User-Model", userModelSchema);

// Relate locations and users
// One location can only belong to one user
// One user can have multiple locations = > []
