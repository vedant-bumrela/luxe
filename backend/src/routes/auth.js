const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validator');
const {
    registerValidator,
    loginValidator,
    changePasswordValidator,
} = require('../validators/authValidators');

// Public routes
router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/change-password', changePasswordValidator, validate, changePassword);

module.exports = router;
