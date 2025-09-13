const express = require('express');
const roleController = require('../controllers/rolecontroller');

const loginRouter = express.Router();

// loginRouter.post('/login', roleController.addRole);


module.exports = loginRouter;