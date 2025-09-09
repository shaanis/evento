const Role = require("../models/roleSchema");

// ➕ Add New Role
exports.addRole = async (req, res) => {
  try {
    const { roleTitle, workWage } = req.body;

    if (!roleTitle || !workWage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRole = new Role({
      roleTitle,
      workWage,
    });

    await newRole.save();

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get All Roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json( roles );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleTitle, workWage } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { roleTitle, workWage },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
