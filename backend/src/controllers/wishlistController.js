const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(ApiResponse.success(user.wishlist, 'Wishlist retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);

        if (user.wishlist.includes(productId)) {
            throw new ApiError(400, 'Product already in wishlist');
        }

        user.wishlist.push(productId);
        await user.save();
        await user.populate('wishlist');

        res.json(ApiResponse.success(user.wishlist, 'Product added to wishlist'));
    } catch (error) {
        next(error);
    }
};

const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);

        await user.save();
        await user.populate('wishlist');

        res.json(ApiResponse.success(user.wishlist, 'Product removed from wishlist'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
