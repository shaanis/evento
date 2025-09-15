const express = require("express")
require("dotenv").config()
const cors = require("cors")
const connectDB = require("./config/db")

const userRoute = require("./routes/userRoute")
const eventRouter = require("./routes/eventRoutes")
const roleRouter = require("./routes/roleRoutes")
const careofRouter = require("./routes/careofRoutes")
const loginRouter = require("./routes/loginRoutes")
const settingsRouter = require('./routes/adminSettingsRoute')

const app = express()
connectDB()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use(userRoute)
app.use(eventRouter)
app.use(roleRouter)
app.use(careofRouter)
app.use(loginRouter)
app.use(settingsRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
