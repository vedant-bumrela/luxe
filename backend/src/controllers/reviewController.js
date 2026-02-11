const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { rating, title, content } = req.body;

        const existingReview = await Review.findOne({ product: productId, user: req.user._id });
        if (existingReview) {
            throw new ApiError(400, 'You have already reviewed this product');
        }

        // Check if user purchased the product
        const userOrders = await Order.find({
            user: req.user._id,
            'items.product': productId,
            orderStatus: 'delivered',
        });

        const isVerifiedPurchase = userOrders.length > 0;

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            rating,
            title,
            content,
            isVerifiedPurchase,
        });

        await review.populate('user', 'firstName lastName avatar');

        res.status(201).json(ApiResponse.created(review, 'Review added successfully'));
    } catch (error) {
        next(error);
    }
};

const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId, status: 'approved' })
            .populate('user', 'firstName lastName avatar')
            .sort('-createdAt');

        res.json(ApiResponse.success(reviews, 'Reviews retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { createReview, getProductReviews };
