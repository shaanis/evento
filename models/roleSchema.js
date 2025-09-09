const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roleTitle: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
    },
    workWage: {
      type: Number,
      required: [true, "Work wage is required"],
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
