const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: String,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    subtotal: {
        type: Number,
        required: true,
    },
});

const addressSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        shippingAddress: {
            type: addressSchema,
            required: true,
        },
        billingAddress: addressSchema,
        paymentMethod: {
            type: String,
            required: true,
            enum: ['card', 'cod', 'upi', 'wallet'],
            default: 'cod',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentId: String,
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0,
        },
        shippingCost: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        notes: String,
        trackingNumber: String,
        estimatedDelivery: Date,
        deliveredAt: Date,
        cancelledAt: Date,
        cancellationReason: String,
    },
    {
        timestamps: true,
    }
);

// Index for faster queries (orderNumber already indexed via unique:true)
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

// Generate order number before saving
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
