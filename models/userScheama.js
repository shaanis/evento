// models/CateringStaff.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// models/CateringStaff.js
const userSchema = new mongoose.Schema(
  {
    profileImage: { type: String, default: "" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
   role: { type: mongoose.Schema.Types.ObjectId, ref: "Role",required: false,default: null,},
    addedby: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    address: { type: String, trim: true },
    careof: { type: Boolean, required: true, default: false },
    blocked: { type: Boolean, required: true, default: false },
    userCode: { type: String, required: true, unique: true }, // e.g. "1001"
    qrCode: { type: String }, // base64 QR string
    password: { type: String, required: true, minlength: 6 },

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);


// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare entered password with hashed one
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("users", userSchema);
