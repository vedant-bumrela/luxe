const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getBestsellers,
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellers);
router.get('/:id', optionalAuth, getProduct);

// Admin routes
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
