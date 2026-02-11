const express = require('express');
const router = express.Router();
const {
    getOverviewStats,
    getRecentOrders,
    getAllUsers
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Analytics routes
router.get('/analytics/overview', getOverviewStats);
router.get('/analytics/recent-orders', getRecentOrders);

// User management
router.get('/users', getAllUsers);

module.exports = router;
