const express = require("express");
const router = express.Router();
const adminSettingsController = require("../controllers/adminSettingsController");

router.get("/get/adminsettings", adminSettingsController.getAdminSettings);
router.put("/update/adminsettings", adminSettingsController.updateAdminSettings);

module.exports = router;
