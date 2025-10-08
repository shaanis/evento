const mongoose = require("mongoose");

const originLocationSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the staff collection
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: () => new Date().toISOString(), // stores UTC timestamp automatically
    },
  },
  { timestamps: true } // includes createdAt & updatedAt
);

module.exports = mongoose.model("OriginLocation", originLocationSchema);
