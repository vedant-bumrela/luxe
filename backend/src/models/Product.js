const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        shortDescription: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: 0,
        },
        originalPrice: {
            type: Number,
            default: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required'],
        },
        brand: {
            type: String,
            default: '',
        },
        images: [{
            type: String,
        }],
        mainImage: {
            type: String,
            default: '',
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
        features: [{
            type: String,
        }],
        specifications: {
            type: Map,
            of: String,
        },
        tags: [{
            type: String,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        sold: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance (slug already indexed via unique:true)
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discount').get(function () {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual for rating (will be calculated from reviews)
productSchema.virtual('rating', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    options: { match: { status: 'approved' } },
});

// Virtual for review count
productSchema.virtual('reviewCount', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    count: true,
    options: { match: { status: 'approved' } },
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Method to check if product is in stock
productSchema.methods.isInStock = function () {
    return this.stock > 0;
};

// Method to check if product is on sale
productSchema.methods.isOnSale = function () {
    return this.originalPrice > 0 && this.originalPrice > this.price;
};

module.exports = mongoose.model('Product', productSchema);
