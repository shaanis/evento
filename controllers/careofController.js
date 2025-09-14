// controllers/careOfController.js
const CareOf = require("../models/careOffScheama");

// Save new CareOf
exports.saveCareOf = async (req, res) => {
  console.log("inside saveCareOf ");
  console.log(req.body);
  console.log(req.file);
  
  
  
  try {
    const { name, email, phone, address, addedby } = req.body;
    const username = name + phone.substring(0, 4);

    // Validate required fields
    if (!name || !email || !phone || !address || !addedby) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, phone, address, addedby"
      });
    }

     const image = req.file ? req.file.path : "";

    // Check if CareOf already exists with same email or phone
    const existingCareOf = await CareOf.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingCareOf) {
      return res.status(409).json({
        success: false,
        message: "CareOf with this email or phone already exists"
      });
    }


    // Create new CareOf
    const newCareOf = new CareOf({
      image,
      name,
      email,
      phone,
      address,
      addedby,
      username
    });

    // Save to database
    const savedCareOf = await newCareOf.save();

    res.status(201).json({
      success: true,
      message: "CareOf created successfully",
      data: savedCareOf
    });

  } catch (error) {
    console.error("Error saving CareOf:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all CareOf
exports.getAllCareOf = async (req, res) => {
  try {
    const careOfList = await CareOf.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "CareOf list retrieved successfully",
      data: careOfList
    });

  } catch (error) {
    console.error("Error fetching CareOf:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update CareOf
exports.updateCareOf = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    // Check if CareOf exists
    const existingCareOf = await CareOf.findById(id);
    if (!existingCareOf) {
      return res.status(404).json({
        success: false,
        message: "CareOf not found"
      });
    }

    // Check if email or phone already exists (excluding current CareOf)
    const duplicateCheck = await CareOf.findOne({
      $and: [
        { _id: { $ne: id } },
        { $or: [{ email }, { phone }] }
      ]
    });

    if (duplicateCheck) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already exists with another CareOf"
      });
    }

    // Update CareOf
    const updatedCareOf = await CareOf.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "CareOf updated successfully",
      data: updatedCareOf
    });

  } catch (error) {
    console.error("Error updating CareOf:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete CareOf
exports.deleteCareOf = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if CareOf exists
    const existingCareOf = await CareOf.findById(id);
    if (!existingCareOf) {
      return res.status(404).json({
        success: false,
        message: "CareOf not found"
      });
    }

    // Delete CareOf
    await CareOf.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "CareOf deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting CareOf:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get CareOf by ID
exports.getCareOfById = async (req, res) => {
  try {
    const { id } = req.params;

    const careOf = await CareOf.findById(id);
    if (!careOf) {
      return res.status(404).json({
        success: false,
        message: "CareOf not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "CareOf retrieved successfully",
      data: careOf
    });

  } catch (error) {
    console.error("Error fetching CareOf:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};