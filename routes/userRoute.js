const express = require("express")
const userRouter = express.Router()
const userController = require("../controllers/userController")
const multerMiddleware = require("../middleware/multerMiddleware")


userRouter.post('/add/staff',multerMiddleware.single("file"),userController.addCateringStaff)
userRouter.post('/login',userController.loginStaff)
userRouter.get('/staff/all',userController.getAllStaff)
userRouter.put( '/update/staff/:id',multerMiddleware.single("file"),userController.updateCateringStaff);



module.exports = userRouter