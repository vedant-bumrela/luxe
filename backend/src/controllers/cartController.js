const User = require('../models/User');
const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.json(ApiResponse.success(user.cart, 'Cart retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        if (product.stock < quantity) {
            throw new ApiError(400, 'Insufficient stock');
        }

        const user = await User.findById(req.user._id);
        const existingItem = user.cart.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        await user.populate('cart.product');

        res.json(ApiResponse.success(user.cart, 'Product added to cart'));
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        const user = await User.findById(req.user._id);
        const item = user.cart.id(itemId);

        if (!item) {
            throw new ApiError(404, 'Cart item not found');
        }

        item.quantity = quantity;
        await user.save();
        await user.populate('cart.product');

        res.json(ApiResponse.success(user.cart, 'Cart updated successfully'));
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(item => item._id.toString() !== itemId);

        await user.save();
        await user.populate('cart.product');

        res.json(ApiResponse.success(user.cart, 'Item removed from cart'));
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.json(ApiResponse.success(null, 'Cart cleared successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
