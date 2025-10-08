const OriginLocation = require("../models/originLocationSchema");

// ✅ Add a new origin location
exports.addOriginLocation = async (req, res) => {

    console.log("inside addOriginLocation");
    console.log(req.body);
    
    
  try {
    const { staffId, latitude, longitude } = req.body;

    if (!staffId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "staffId, latitude, and longitude are required",
      });
    }

    // Create a new record with current UTC time
    const newLocation = new OriginLocation({
      staffId,
      latitude,
      longitude,
      timestamp: new Date().toISOString(), // store UTC time
    });

    await newLocation.save();

    res.status(201).json({
      success: true,
      message: "Origin location saved successfully",
      data: newLocation,
    });
  } catch (error) {
    console.error("Error saving origin location:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all origin locations (optional)
exports.getAllOriginLocations = async (req, res) => {
  try {
    const locations = await OriginLocation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching origin locations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get locations by staffId
exports.getOriginLocationsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const locations = await OriginLocation.find({ staffId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching staff origin locations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
