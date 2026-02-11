const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, 'Review title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Review content is required'],
        },
        images: [{
            type: String,
        }],
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpful: {
            type: Number,
            default: 0,
        },
        unhelpful: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
