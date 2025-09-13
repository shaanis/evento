const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
    },
    wage: {
      type: String,
      required: [true, "Work wage is required"],
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
