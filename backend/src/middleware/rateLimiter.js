const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter - 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for auth routes - 5 requests per 15 minutes
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * File upload rate limiter - 10 uploads per hour
 */
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: {
        success: false,
        message: 'Too many file uploads, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    uploadLimiter,
};
