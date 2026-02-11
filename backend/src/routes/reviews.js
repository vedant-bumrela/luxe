const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/products/:productId', getProductReviews);
router.post('/products/:productId', protect, createReview);

module.exports = router;
