const express = require('express');
const roleController = require('../controllers/rolecontroller');

const roleRouter = express.Router();

// Get all roles
roleRouter.get('/roles/all', roleController.getRoles);

// Create a new role
roleRouter.post('/role/add', roleController.addRole);

// Update a role by ID
roleRouter.put('/role/update/:id', roleController.updateRole);

// Delete a role by ID
roleRouter.delete('/role/delete/:id', roleController.deleteRole);

module.exports = roleRouter;