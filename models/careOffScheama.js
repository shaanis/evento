const mongoose = require("mongoose");

const careOfSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String},
  address: { type: String},
  addedby: { type: String},
  username: { type: String},
  image: { type: String }, // Cloudinary image URL
   blocked: { type: Boolean,  default: false },
});

module.exports = mongoose.model("CareOf", careOfSchema);
