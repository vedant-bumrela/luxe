const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, 'Email already registered');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });

        // Generate tokens
        const accessToken = generateAccessToken({ id: user._id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user._id });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json(
            ApiResponse.created(
                {
                    user: user.toJSON(),
                    accessToken,
                },
                'Registration successful'
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        console.log('🔍 Login attempt for:', email);
        console.log('👤 User found:', !!user);
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        // Check password
        console.log('🔑 Checking password...');
        console.log('   Input password:', password);
        console.log('   Stored hash:', user.password?.substring(0, 20) + '...');
        const isPasswordValid = await comparePassword(password, user.password);
        console.log('   Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user._id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user._id });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json(
            ApiResponse.success(
                {
                    user: user.toJSON(),
                    accessToken,
                },
                'Login successful'
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
    try {
        // Clear refresh token
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

        // Clear cookie
        res.clearCookie('refreshToken');

        res.json(ApiResponse.success(null, 'Logout successful'));
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token not provided');
        }

        // Verify refresh token
        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        // Generate new access token
        const accessToken = generateAccessToken({ id: user._id, email: user.email });

        res.json(
            ApiResponse.success(
                { accessToken },
                'Token refreshed successfully'
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('cart.product')
            .populate('wishlist');

        res.json(ApiResponse.success(user, 'User retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        // Verify current password
        const isPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Current password is incorrect');
        }

        // Hash new password
        user.password = await hashPassword(newPassword);
        await user.save();

        res.json(ApiResponse.success(null, 'Password changed successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
};
