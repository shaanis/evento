// routes/careofRoutes.js
const express = require("express");
const careofRouter = express.Router();
const careOfController = require("../controllers/careofController");
const multerMiddleware = require("../middleware/multerMiddleware");

// CareOf routes with file upload support
careofRouter.post("/add/careof", multerMiddleware.single("file"), careOfController.saveCareOf);
careofRouter.get("/get/careof", careOfController.getAllCareOf);
careofRouter.get("/get/careof/:id", careOfController.getCareOfById);
careofRouter.put("/update/careof/:id", multerMiddleware.single("file"), careOfController.updateCareOf);
careofRouter.delete("/delete/careof/:id", careOfController.deleteCareOf);

module.exports = careofRouter;