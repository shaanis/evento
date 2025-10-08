const express = require("express");
const fineRouter = express.Router();
const finesController = require("../controllers/fineControlller");

// Get all fines
fineRouter.get("/get/fines", finesController.getAllFines);

// Get a single fine by ID
fineRouter.get("/get/fine/:id", finesController.getFineById);

// Add a new fine
fineRouter.post("/add/fine", finesController.addFine);

// Update an existing fine by ID
fineRouter.put("/update/fine/:id", finesController.updateFine);

// Delete a fine by ID
fineRouter.delete("/delete/fine/:id", finesController.deleteFine);

module.exports = fineRouter;
