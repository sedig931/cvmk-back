const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  frames: {
    type: mongoose.Schema.Types.Array,
    default: [],
  },
  createdDate: {
    type: mongoose.Schema.Types.String,
    default: new Date(),
  },
  framePhotoNames: {
    type: mongoose.Schema.Types.Array,
    default: [],
  },
});

module.exports = mongoose.model("customer", customerSchema);
