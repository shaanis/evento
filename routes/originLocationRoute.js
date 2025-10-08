const express = require("express");
const originRouter = express.Router();
const originLocationController = require("../controllers/originLocationController");

// Save a new origin location (with staffId, lat, long, and UTC time)
originRouter.post("/add/originlocation", originLocationController.addOriginLocation);

// // Get all origin locations (optional)
// router.get("/get/originlocations", originLocationController.getAllOriginLocations);

// // Get origin locations for a specific staff
// router.get("/get/originlocations/:staffId", originLocationController.getOriginLocationsByStaff);

module.exports = originRouter;
