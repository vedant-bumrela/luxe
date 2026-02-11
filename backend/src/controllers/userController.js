const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(ApiResponse.success(user, 'Profile retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, phone, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, phone, avatar },
            { new: true, runValidators: true }
        );

        res.json(ApiResponse.success(user, 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
};

const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses.push(req.body);
        await user.save();

        res.status(201).json(ApiResponse.created(user.addresses, 'Address added successfully'));
    } catch (error) {
        next(error);
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            throw new ApiError(404, 'Address not found');
        }

        Object.assign(address, req.body);
        await user.save();

        res.json(ApiResponse.success(user.addresses, 'Address updated successfully'));
    } catch (error) {
        next(error);
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
        await user.save();

        res.json(ApiResponse.success(user.addresses, 'Address deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getProfile, updateProfile, addAddress, updateAddress, deleteAddress };
