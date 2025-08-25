const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

// GET /api/users - Fetch all users
router.get('/', userController.getUsers.bind(userController));

// GET /api/users/:userId/devices - Fetch user devices
router.get('/:userId/devices', userController.getUserDevices.bind(userController));

// GET /api/users/:userId - Fetch user with devices
router.get('/:userId', userController.getUserWithDevices.bind(userController));

module.exports = router;