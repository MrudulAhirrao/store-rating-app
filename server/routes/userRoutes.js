const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, isAdmin, userController.getAllUsers);

module.exports = router;