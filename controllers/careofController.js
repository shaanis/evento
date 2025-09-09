const CareOf = require("../models/careOffScheama");

// ➕ Add New CareOf
exports.addCareOf = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, username } = req.body;
    let profileImage = "";

    if (req.file) {
      profileImage = req.file.path;
    }

    if (!fullName || !phoneNumber || !email || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newCareOf = new CareOf({
      profileImage,
      fullName,
      phoneNumber,
      email,
      username,
    });

    await newCareOf.save();

    res.status(201).json({
      success: true,
      message: "CareOf created successfully",
      data: newCareOf,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


// 📌 Get All CareOf
exports.getCareOf = async (req, res) => {
  try {
    const allCareOf = await CareOf.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: allCareOf });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update CareOf
exports.updateCareOf = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, email, username } = req.body;

    let updateData = { fullName, phoneNumber, email, username };

    if (req.file) {
      updateData.profileImage = req.file.path; // or Cloudinary secure_url
    }

    const updatedCareOf = await CareOf.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCareOf) {
      return res.status(404).json({ message: "CareOf not found" });
    }

    res.status(200).json({
      success: true,
      message: "CareOf updated successfully",
      data: updatedCareOf,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete CareOf
exports.deleteCareOf = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CareOf.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "CareOf not found" });
    }

    res.status(200).json({
      success: true,
      message: "CareOf deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
