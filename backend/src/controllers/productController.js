const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Get all products with filters and pagination
 * GET /api/products
 */
const getProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            brand,
            minPrice,
            maxPrice,
            tags,
            search,
            sort = '-createdAt',
            showInactive = 'false', // Allow showing inactive products for admin
        } = req.query;

        // Build filter object
        // Only filter by isActive if showInactive is not true (for admin)
        const filter = {};
        if (showInactive !== 'true') {
            filter.isActive = true;
        }

        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) filter.category = cat._id;
        }

        if (brand) filter.brand = brand;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (tags) {
            filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        res.json(
            ApiResponse.success(
                products,
                'Products retrieved successfully',
                200,
                {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                }
            )
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get single product by ID or slug
 * GET /api/products/:id
 */
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            $or: [{ _id: id }, { slug: id }],
        }).populate('category', 'name slug');

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.json(ApiResponse.success(product, 'Product retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(ApiResponse.created(product, 'Product created successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        res.json(ApiResponse.success(product, 'Product updated successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        res.json(ApiResponse.success(null, 'Product deleted successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Get featured products
 * GET /api/products/featured
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isFeatured: true, isActive: true })
            .populate('category', 'name slug')
            .limit(8);

        res.json(ApiResponse.success(products, 'Featured products retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

/**
 * Get bestseller products
 * GET /api/products/bestsellers
 */
const getBestsellers = async (req, res, next) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate('category', 'name slug')
            .sort('-sold')
            .limit(8);

        res.json(ApiResponse.success(products, 'Bestsellers retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getBestsellers,
};
