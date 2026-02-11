const ApiError = require('../utils/ApiError');

/**
 * Check if user has admin role
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        throw new ApiError(403, 'Access denied. Admin privileges required');
    }
};

/**
 * Check if user has specific role(s)
 */
const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, 'Not authorized');
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            throw new ApiError(
                403,
                `Access denied. Required roles: ${roles.join(', ')}`
            );
        }
    };
};

module.exports = {
    isAdmin,
    hasRole,
};
