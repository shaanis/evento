const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  travelAllowanceEnabled: { type: Boolean, default: false },
  careofCommissionEnabled: { type: Boolean, default: false },
  careofCommissionAmount: { type: Number, default: 0 }, // ₹ per staff
  notificationsEnabled: { type: Boolean, default: true },
 
}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
