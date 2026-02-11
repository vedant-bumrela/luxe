const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get dashboard overview statistics
 * @route   GET /api/admin/analytics/overview
 * @access  Private/Admin
 */
const getOverviewStats = asyncHandler(async (req, res) => {
    // Get total revenue from completed orders
    const revenueResult = await Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get total customers (users with role customer)
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate revenue change (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
                status: { $in: ['delivered', 'shipped'] }
            }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const previousRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
                status: { $in: ['delivered', 'shipped'] }
            }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentRevenueTotal = recentRevenue[0]?.total || 0;
    const previousRevenueTotal = previousRevenue[0]?.total || 1; // Avoid division by zero
    const revenueChange = ((recentRevenueTotal - previousRevenueTotal) / previousRevenueTotal * 100).toFixed(1);

    // Calculate orders change
    const recentOrders = await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const previousOrders = await Order.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    const ordersChange = previousOrders > 0
        ? ((recentOrders - previousOrders) / previousOrders * 100).toFixed(1)
        : 0;

    // Calculate customers change
    const recentCustomers = await User.countDocuments({
        role: 'customer',
        createdAt: { $gte: thirtyDaysAgo }
    });
    const previousCustomers = await User.countDocuments({
        role: 'customer',
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });
    const customersChange = previousCustomers > 0
        ? ((recentCustomers - previousCustomers) / previousCustomers * 100).toFixed(1)
        : 0;

    res.json(ApiResponse.success({
        revenue: {
            total: totalRevenue,
            change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
            trend: revenueChange >= 0 ? 'up' : 'down'
        },
        orders: {
            total: totalOrders,
            change: `${ordersChange > 0 ? '+' : ''}${ordersChange}%`,
            trend: ordersChange >= 0 ? 'up' : 'down'
        },
        products: {
            total: totalProducts,
            change: '+5', // You can calculate this if you track product changes
            trend: 'up'
        },
        customers: {
            total: totalCustomers,
            change: `${customersChange > 0 ? '+' : ''}${customersChange}%`,
            trend: customersChange >= 0 ? 'up' : 'down'
        }
    }));
});

/**
 * @desc    Get recent orders for dashboard
 * @route   GET /api/admin/analytics/recent-orders
 * @access  Private/Admin
 */
const getRecentOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber user items totalAmount status createdAt');

    const formattedOrders = orders.map(order => ({
        id: order.orderNumber,
        customer: order.user?.name || 'Unknown',
        email: order.user?.email || '',
        items: order.items.length,
        total: order.totalAmount,
        status: order.status,
        date: order.createdAt
    }));

    res.json(ApiResponse.success(formattedOrders));
});

/**
 * @desc    Get all users with pagination
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    // Get order count for each user
    const usersWithOrders = await Promise.all(
        users.map(async (user) => {
            const orderCount = await Order.countDocuments({ user: user._id });
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                orders: orderCount,
                joined: user.createdAt,
                status: 'active' // You can add an active field to User model if needed
            };
        })
    );

    res.json(ApiResponse.success({
        users: usersWithOrders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    }));
});

module.exports = {
    getOverviewStats,
    getRecentOrders,
    getAllUsers
};
