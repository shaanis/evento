const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
  name: { type: String, required: true },        // Fine name
  amount: { type: Number, required: true },      // Fine amount in ₹
  description: { type: String, default: "" },    // Optional description
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin/staff who created the fine
}, { timestamps: true });

module.exports = mongoose.model("Fine", fineSchema);
