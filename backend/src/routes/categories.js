const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin routes
router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
