const express = require("express");
const careofRouter = express.Router();
const careOfController = require("../controllers/careofController");
const multer = require("../middleware/multerMiddleware"); // if you want image upload

careofRouter.post("/careof/add", multer.single("profileImage"), careOfController.addCareOf);
careofRouter.get("/careof/all", careOfController.getCareOf);
careofRouter.put("/careof/update/:id", multer.single("profileImage"), careOfController.updateCareOf);
careofRouter.delete("/careof/delete/:id", careOfController.deleteCareOf);

module.exports = careofRouter;
