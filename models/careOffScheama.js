const mongoose = require("mongoose");

const careOfSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String},
  address: { type: String},
  addedby: { type: String},
  username: { type: String},
  image: { type: String }, // Cloudinary image URL
});

module.exports = mongoose.model("CareOf", careOfSchema);
