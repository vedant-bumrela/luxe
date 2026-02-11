const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token
 * @param {Object} payload - User data to encode
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - User data to encode
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
    });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key
 * @returns {Object} Decoded token
 */
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
};
