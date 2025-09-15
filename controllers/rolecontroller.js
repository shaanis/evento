const Role = require("../models/roleSchema");

// ➕ Add New Role
exports.addRole = async (req, res) => {


  
  
  try {
    const { role, wage } = req.body;

    if (!role || !wage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingRole = await Role.findOne({ role: { $regex: new RegExp(`^${role}$`, "i") } });

    if (existingRole) {
      return res.status(409).json({ 
        success: false, 
        message: "Role already exists", 
        data: existingRole 
      });
    }

    const newRole = new Role({
      role,
      wage,
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

  console.log("Update Role Called");
  
  try {
    const { id } = req.params;
    const { role, wage } = req.body;

  
   
    

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { role, wage },
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
    console.log(error);
    
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
