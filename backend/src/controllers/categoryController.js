const Category = require('../models/Category');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('productCount')
            .sort('order');

        res.json(ApiResponse.success(categories, 'Categories retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        res.json(ApiResponse.success(category, 'Category retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(ApiResponse.created(category, 'Category created successfully'));
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        res.json(ApiResponse.success(category, 'Category updated successfully'));
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        res.json(ApiResponse.success(null, 'Category deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
