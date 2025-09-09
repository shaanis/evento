const express = require("express")
const userRouter = express.Router()
const userController = require("../controllers/userController")
const multerMiddleware = require("../middleware/multerMiddleware")


userRouter.post('/add/staff',multerMiddleware.single("profileImage"),userController.addCateringStaff)
userRouter.post('/login',userController.loginStaff)

module.exports = userRouter