const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['home', 'office', 'other'],
        default: 'home',
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: String,
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
        default: 'India',
    },
    postalCode: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        avatar: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        cart: [cartItemSchema],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        addresses: [addressSchema],
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
        refreshToken: String,
    },
    {
        timestamps: true,
    }
);

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    delete user.emailVerificationToken;
    delete user.refreshToken;
    return user;
};

module.exports = mongoose.model('User', userSchema);
