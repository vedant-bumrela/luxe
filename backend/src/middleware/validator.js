const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to handle validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => ({
            field: error.path || error.param,
            message: error.msg,
        }));

        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Validation failed',
            errors: errorMessages,
        });
    }

    next();
};

module.exports = validate;
