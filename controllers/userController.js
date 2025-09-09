// controllers/cateringStaffController.js
const User = require("../models/userScheama");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");


// Add new staff
exports.addCateringStaff = async (req, res) => {
    console.log("inside adding staff", req.body);
    console.log("inside adding staff files", req.file);
  
    try {
      const { name, userName, careOf, email, phone, address } = req.body; // ✅ multer parses fields
  
      const autoPassword =
        userName.substring(0, 4).toLowerCase() + phone.substring(0, 4);
  
      const profileImage = req.file ? req.file.path : "";
  
      const newStaff = new User({
        profileImage,
        name,
        userName,
        careOf,
        email,
        phone,
        address,
        password: autoPassword,
      });
  
      await newStaff.save();
  
      await sendEmail(
        email,
        "Your Catering Staff Account",
        `Hello ${name},\n\nYour catering staff account has been created successfully.\n\nUsername: ${userName}\nPassword: ${autoPassword}\n\nYou can now log in using these credentials.`
      );
  
      res.status(201).json({
        message: "Catering staff added & login credentials sent via email",
        staff: newStaff,
      });
    } catch (error) {
      console.error(error);
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
  console.log(req.userId);
  


  try {
    const { userNameOrEmail, password } = req.body;

    if (!userNameOrEmail || !password) {
      return res.status(400).json({ message: "Please provide email/username and password" });
    }

    // 🔍 Find staff by email OR username
    const staff = await User.findOne({
      $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }],
    });

    if (!staff) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔑 Compare entered password with hashed password
    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = generateToken(staff._id);

    res.status(200).json({
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        userName: staff.userName,
        email: staff.email,
        phone: staff.phone,
        profileImage: staff.profileImage,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};