const mongoose = require("mongoose");

const careOfSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "", // Cloudinary or any uploaded image URL
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareOf", careOfSchema);
