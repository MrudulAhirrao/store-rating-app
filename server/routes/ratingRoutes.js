const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, ratingController.submitRating);

module.exports = router;