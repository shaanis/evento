const AdminSettings = require("../models/adminSettingsSchema");

// ✅ Get current settings
exports.getAdminSettings = async (req, res) => {
  try {
    // Find the first settings document (or create if none exists)
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Update settings
exports.updateAdminSettings = async (req, res) => {
    console.log(req.body);
    
  try {
    const updateData = req.body;

    // Update the first document (create if not exists)
    let settings = await AdminSettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
