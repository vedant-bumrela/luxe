const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new ApiError(404, `Product not found: ${item.product}`);
            }

            if (product.stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name}`);
            }

            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.mainImage || product.images[0],
                price: product.price,
                quantity: item.quantity,
                subtotal: itemSubtotal,
            });

            // Update product stock and sold count
            product.stock -= item.quantity;
            product.sold += item.quantity;
            await product.save();
        }

        const tax = subtotal * 0.18; // 18% tax
        const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above 500
        const total = subtotal + tax + shippingCost;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            subtotal,
            tax,
            shippingCost,
            total,
        });

        // Clear user's cart
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.status(201).json(ApiResponse.created(order, 'Order created successfully'));
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name slug mainImage')
            .sort('-createdAt');

        res.json(ApiResponse.success(orders, 'Orders retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name slug mainImage');

        if (!order) {
            throw new ApiError(404, 'Order not found');
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new ApiError(403, 'Not authorized to view this order');
        }

        res.json(ApiResponse.success(order, 'Order retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getOrders, getOrder };
