const ApiError = require('../utils/ApiError');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // If error is not an instance of ApiError, create one
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, false, err.stack);
    }

    // Prepare error response
    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        response.statusCode = 400;
        response.message = 'Validation Error';
        response.details = errors;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        response.statusCode = 400;
        response.message = `${field} already exists`;
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        response.statusCode = 400;
        response.message = `Invalid ${err.path}: ${err.value}`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        response.statusCode = 401;
        response.message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        response.statusCode = 401;
        response.message = 'Token expired';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', error);
    }

    res.status(response.statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
    next(error);
};

module.exports = {
    errorHandler,
    notFound,
};
