const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         description: Okta user filter expression
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users fetched
 *       500:
 *         description: Server error
 */
router.get('/', userController.getUsers.bind(userController));

/**
 * @swagger
 * /api/users/{userId}/devices:
 *   get:
 *     summary: Get user devices
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devices fetched
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId/devices', userController.getUserDevices.bind(userController));

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user with devices
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User with devices
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId', userController.getUserWithDevices.bind(userController));

module.exports = router;