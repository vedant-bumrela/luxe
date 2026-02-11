require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { hashPassword } = require('../utils/passwordHash');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const adminPassword = await hashPassword('admin123');
        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@luxe.com',
            password: adminPassword,
            role: 'admin',
            isEmailVerified: true,
        });
        console.log(`✅ Admin created: ${admin.email} / admin123`);

        // Create categories
        console.log('📂 Creating categories...');
        const categories = await Category.insertMany([
            {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Latest gadgets and electronics',
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
                order: 1,
            },
            {
                name: 'Fashion',
                slug: 'fashion',
                description: 'Trendy clothing and accessories',
                image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
                order: 2,
            },
            {
                name: 'Home & Living',
                slug: 'home-living',
                description: 'Beautiful home decor and furniture',
                image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80',
                order: 3,
            },
            {
                name: 'Sports & Fitness',
                slug: 'sports-fitness',
                description: 'Gear up for your fitness journey',
                image: 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=80',
                order: 4,
            },
            {
                name: 'Beauty',
                slug: 'beauty',
                description: 'Premium beauty and skincare',
                image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
                order: 5,
            },
            {
                name: 'Books',
                slug: 'books',
                description: 'Books for every reader',
                image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
                order: 6,
            },
        ]);
        console.log(`✅ ${categories.length} categories created`);

        // Create products
        console.log('📦 Creating products...');
        const products = await Product.insertMany([
            {
                name: 'Premium Wireless Headphones',
                slug: 'premium-wireless-headphones',
                description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation and 40-hour battery life.',
                shortDescription: 'Premium ANC headphones with 40hr battery',
                price: 299.99,
                originalPrice: 399.99,
                category: categories[0]._id,
                brand: 'AudioPro',
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
                ],
                mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                stock: 50,
                sku: 'AUDIO-HP001',
                features: ['Active Noise Cancellation', '40-hour Battery Life', 'Premium Memory Foam', 'Bluetooth 5.2'],
                tags: ['bestseller', 'new'],
                isFeatured: true,
            },
            {
                name: 'Minimalist Leather Watch',
                slug: 'minimalist-leather-watch',
                description: 'Elegant minimalist watch with Italian leather strap. Swiss movement ensures precision timekeeping.',
                price: 450.00,
                category: categories[1]._id,
                brand: 'Chronos',
                images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
                stock: 30,
                sku: 'CHRN-WATCH01',
                features: ['Swiss Movement', 'Sapphire Crystal', 'Italian Leather', '50m Water Resistant'],
                tags: ['premium', 'bestseller'],
                isFeatured: true,
            },
            {
                name: 'Smart Home Speaker',
                slug: 'smart-home-speaker',
                description: 'Voice-controlled smart speaker with 360-degree sound. Control your smart home with ease.',
                price: 159.99,
                originalPrice: 199.99,
                category: categories[0]._id,
                brand: 'SoundWave',
                images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80',
                stock: 75,
                features: ['360° Sound', 'Voice Assistant', 'Smart Home Hub', 'Privacy Button'],
                tags: ['sale', 'popular'],
            },
            {
                name: 'Organic Cotton T-Shirt',
                slug: 'organic-cotton-tshirt',
                description: 'Soft, breathable organic cotton t-shirt. Perfect for everyday wear.',
                price: 49.99,
                category: categories[1]._id,
                brand: 'EcoWear',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
                stock: 100,
                features: ['100% Organic Cotton', 'Fair Trade', 'Machine Washable', 'Sustainable'],
                tags: ['new', 'eco'],
            },
            {
                name: 'Designer Desk Lamp',
                slug: 'designer-desk-lamp',
                description: 'Handcrafted oak desk lamp with adjustable arm. Perfect blend of form and function.',
                price: 189.99,
                category: categories[2]._id,
                brand: 'Nordic Design',
                images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
                stock: 25,
                features: ['Hand-crafted Oak', 'Adjustable Arm', 'Dimmable', 'LED Compatible'],
                tags: ['premium', 'design'],
                isFeatured: true,
            },
            {
                name: 'Professional Running Shoes',
                slug: 'professional-running-shoes',
                description: 'High-performance running shoes with carbon fiber plate and responsive foam.',
                price: 179.99,
                originalPrice: 219.99,
                category: categories[3]._id,
                brand: 'SwiftRun',
                images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
                stock: 60,
                features: ['Carbon Fiber Plate', 'Responsive Foam', 'Breathable Mesh', 'Ultra-light'],
                tags: ['bestseller', 'sale'],
            },
            {
                name: 'Luxury Skincare Set',
                slug: 'luxury-skincare-set',
                description: 'Complete skincare routine with natural ingredients. Includes cleanser, serum, and moisturizer.',
                price: 225.00,
                category: categories[4]._id,
                brand: 'Glow Lab',
                images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
                stock: 40,
                features: ['Natural Ingredients', 'Dermatologist Tested', 'Cruelty-Free', 'Complete Set'],
                tags: ['premium', 'new'],
            },
            {
                name: 'Yoga Mat Premium',
                slug: 'yoga-mat-premium',
                description: 'Eco-friendly yoga mat with extra cushioning. Non-slip surface with alignment markers.',
                price: 79.99,
                category: categories[3]._id,
                brand: 'ZenFlow',
                images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'],
                mainImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
                stock: 55,
                features: ['Eco-Friendly', 'Extra Thick', 'Non-Slip', 'Alignment Markers'],
                tags: ['bestseller'],
            },
        ]);
        console.log(`✅ ${products.length} products created`);

        console.log('\\n✨ Database seeded successfully!\\n');
        console.log('📊 Summary:');
        console.log(`   Users: 1 (admin@luxe.com / admin123)`);
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Products: ${products.length}`);
        console.log('\\n🚀 You can now start the server!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
