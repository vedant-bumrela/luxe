const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        console.log('🔐 Protect middleware triggered');
        console.log('   Authorization header:', req.headers.authorization);
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check for token in cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            console.log('   ✗ No token found');
            throw new ApiError(401, 'Not authorized, no token provided');
        }

        console.log('   ✓ Token found, preview:', token.substring(0, 20) + '...');

        // Verify token
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        console.log('   ✓ Token verified, user ID:', decoded.id);

        // Find user and attach to request
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('   ✗ User not found in database');
            throw new ApiError(401, 'User not found');
        }

        console.log('   ✓ User authenticated:', user.email, 'Role:', user.role);

        req.user = user;
        next();
    } catch (error) {
        if (error.message === 'Invalid or expired token') {
            next(new ApiError(401, 'Not authorized, token invalid or expired'));
        } else {
            next(error);
        }
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (token) {
            const decoded = verifyToken(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without user if token is invalid
        next();
    }
};

module.exports = {
    protect,
    optionalAuth,
};
