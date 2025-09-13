// controllers/cateringStaffController.js
const User = require("../models/userScheama");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const CareOf = require("../models/careOffScheama");
const { getNextUniqueCode } = require("../utils/getUniqueCode");
const QRCode = require("qrcode");
const bcrypt = require('bcryptjs');




exports.addCateringStaff = async (req, res) => {
  console.log("inside addCateringStaff");
  console.log(req.body);
  console.log(req.file);


  try {
    const { name, email, phone, addedby, address, careOf } = req.body;

    // ✅ Duplicate check
    const existingUser = await User.findOne({ email });
    const existingCareOf = await CareOf.findOne({ email });
    if (existingUser || existingCareOf) {
      return res.status(409).json({ message: "Email already exists" });

    }
 const role = req.body.role && req.body.role !== "" ? req.body.role : null;



    // ✅ Generate auto password
    const autoPassword = phone.substring(0, 6);

    // ✅ Generate unique 4-digit code (starting from 1000)
    const userCode = await getNextUniqueCode("users");

    const profileImage = req.file ? req.file.path : "";

    // ✅ Generate QR Code
    const qrPayload = { name, userCode, addedby };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));

    // ✅ Save staff
    const newStaff = new User({
      profileImage,
      name,
      email,
      phone,
      role,
      addedby,
      address,
      careof: careOf === "true" || careOf === true,
      password: autoPassword,
      userCode,
      qrCode,
    });

    await newStaff.save();

    console.log("staff added :", newStaff);


    // ✅ If careOf staff → also save in CareOf collection
    if (careOf === "true" || careOf === true) {
      const username = name + phone.substring(0, 4);
      await new CareOf({
        name,
        email,
        phone,
        address,
        addedby,
        username,
      }).save();
    }

    // console.log("careof added :",CareOf);


    res.status(201).json({
      message: "Catering staff added with unique code & QR",
      staff: newStaff,
    });
  } catch (error) {
    console.error("❌ Error adding staff:", error);
    res.status(400).json({
      message: "Error adding staff",
      error: error.message,
    });
  }
};



// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find().sort({ createdAt: -1 });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error: error.message });
  }
};

// Get single staff
exports.getStaffById = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error: error.message });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.profileImage = req.file.path;
    }

    const staff = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff updated", staff });
  } catch (error) {
    res.status(400).json({ message: "Error updating staff", error: error.message });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await User.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error: error.message });
  }
};



// exports.loginStaff = async (req, res) => {
//   console.log("inside login", req.body);

//   try {
//     const { userNameOrEmail, password } = req.body;


//     // 🔍 Find staff by username or email
//     const staff = await User.findOne({
//       $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }],
//     });

//     if (!staff) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 🔐 Compare entered password with hashed password
//     const isMatch = await staff.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // ✅ Generate JWT token
//     const token = generateToken(staff._id);

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       staff: {
//         id: staff._id,
//         name: staff.name,
//         userName: staff.userName,
//         email: staff.email,
//         phone: staff.phone,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Login failed", error: error.message });
//   }
// };

exports.loginStaff = async (req, res) => {
  console.log("📥 Login request body:", req.body);

  try {
    const { userNameOrEmail, password } = req.body;

    if (!userNameOrEmail || !password) {
      return res.status(400).json({ message: "Please provide email/username and password" });
    }

    // 1️⃣ Find the user by email or username
    const staff = await User.findOne({
      $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }]
    }).populate('role'); // populate role object

    if (!staff) {
      console.log("❌ User not found:", userNameOrEmail);
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      console.log("❌ Invalid password for user:", userNameOrEmail);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT token
    const token = generateToken(staff._id);

    console.log("✅ Login successful for user:", staff);

    res.status(200).json({
      message: "Login successful",
      token,
      staff, // role is populated
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};