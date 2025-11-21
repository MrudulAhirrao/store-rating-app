
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, storeController.getAllStores);
router.get('/my-stats', authenticate, storeController.getMyStoreStats);
router.post('/', authenticate, isAdmin, storeController.createStore);

module.exports = router;