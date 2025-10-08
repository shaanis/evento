const express = require('express');
const attandanceController = require('../controllers/attandanceController');

const attandanceRouter = express.Router();

attandanceRouter.post('/attandance/add', attandanceController.addAttandance);
attandanceRouter.get("/attandance/check/:staffId/:eventId", attandanceController.checkAttendanceExists);
attandanceRouter.get("/attandance/event/:eventId", attandanceController.getAttendanceByEvent);
attandanceRouter.get("/attandance/event/single/:eventId/:staffId", attandanceController.getAttendanceByEventAndStaff);


module.exports = attandanceRouter;