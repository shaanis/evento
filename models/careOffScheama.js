// models/careOf.js
const mongoose = require("mongoose");

const careOfSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  addedby: String,
  username: String, // also assign uniqueCode here
});

module.exports = mongoose.model("CareOf", careOfSchema);
