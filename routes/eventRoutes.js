const express = require("express")
const eventRouter = express.Router()
const eventController = require("../controllers/eventController")
const multerMiddleware = require("../middleware/multerMiddleware")


eventRouter.post('/add/event',eventController.addEvent)
eventRouter.get('/admin/all/events',eventController.getEvents)
eventRouter.get('/event/all',eventController.allevents)
eventRouter.get('/user/all/events',eventController.getUserEvents)
eventRouter.put('/update/event/:id',eventController.updateEvent)
eventRouter.delete('/delete/event/:id',eventController.deleteEvent)

module.exports = eventRouter    