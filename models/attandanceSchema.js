const mongoose = require("mongoose");

const attandanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  entry: { type: String, required: true },
  exit: { type: String, required: false },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  travelledKm: { type: Number, default: 0 }, // new field
});

module.exports = mongoose.model("attandance", attandanceSchema);
