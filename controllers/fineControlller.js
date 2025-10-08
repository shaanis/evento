const Fines = require("../models/fineSchema");

// ✅ Get all fines
exports.getAllFines = async (req, res) => {
  try {
    const fines = await Fines.find();
    res.status(200).json({
      success: true,
      data: fines,
    });
  } catch (error) {
    console.error("Error fetching fines:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get single fine by ID
exports.getFineById = async (req, res) => {
  try {
    const { id } = req.params;
    const fine = await Fines.findById(id);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fine,
    });
  } catch (error) {
    console.error("Error fetching fine:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addFine = async (req, res) => {
  console.log("inside addFine");

  try {
    const { name, amount } = req.body;

    if (!name || amount == null) {
      return res.status(400).json({
        success: false,
        message: "Name and amount are required",
      });
    }

    // ✅ Check for duplicate fine name
    const existingFine = await Fines.findOne({ name: name.trim() });
    if (existingFine) {
      return res.status(400).json({
        success: false,
        message: "A fine with this name already exists",
      });
    }

    const fine = new Fines({ name: name.trim(), amount });
    await fine.save();

    console.log(fine);

    res.status(201).json({
      success: true,
      message: "Fine added successfully",
      data: fine,
    });
  } catch (error) {
    console.error("Error adding fine:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ✅ Update fine by ID
exports.updateFine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const fine = await Fines.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fine updated successfully",
      data: fine,
    });
  } catch (error) {
    console.error("Error updating fine:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Delete fine by ID
exports.deleteFine = async (req, res) => {
  try {
    const { id } = req.params;

    const fine = await Fines.findByIdAndDelete(id);

    if (!fine) {
      return res.status(404).json({
        success: false,
        message: "Fine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fine deleted successfully",
      data: fine,
    });
  } catch (error) {
    console.error("Error deleting fine:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
