# Luxe Backend - Quick Reference

## 🚀 Quick Start

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your MongoDB Atlas and Cloudinary credentials

# 2. Seed database
npm run seed

# 3. Start server
npm run dev
```

Server runs at: **http://localhost:5000**

---

## 🔑 Default Credentials

**Admin Account:**
- Email: `admin@luxe.com`
- Password: `admin123`

---

## 📡 Key API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout  
GET    /api/auth/me            - Get current user
PUT    /api/auth/change-password - Change password
```

### Products
```
GET    /api/products           - List products (with filters)
GET    /api/products/:id       - Get single product
POST   /api/products           - Create product (Admin)
PUT    /api/products/:id       - Update product (Admin)
DELETE /api/products/:id       - Delete product (Admin)
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `category` - Filter by category slug
- `brand` - Filter by brand
- `minPrice`, `maxPrice` - Price range
- `search` - Search query
- `sort` - Sort field

### Cart
```
GET    /api/cart               - Get cart
POST   /api/cart               - Add to cart
PUT    /api/cart/:itemId       - Update quantity
DELETE /api/cart/:itemId       - Remove item
```

### Orders
```
POST   /api/orders             - Create order
GET    /api/orders             - Get user orders
GET    /api/orders/:id         - Get order details
```

### Reviews
```
POST   /api/reviews/products/:productId  - Add review
GET    /api/reviews/products/:productId  - Get reviews
```

---

## 🔐 Authentication

Include JWT token in requests:
```
Authorization: Bearer <your_access_token>
```

Or use cookies for automatic token management.

---

## 📦 Sample Data

**Categories:** 6
- Electronics, Fashion, Home & Living, Sports & Fitness, Beauty, Books

**Products:** 8
- Premium Wireless Headphones (₹299.99)
- Minimalist Leather Watch (₹450.00)
- Smart Home Speaker (₹159.99)
- Organic Cotton T-Shirt (₹49.99)
- Designer Desk Lamp (₹189.99)
- Professional Running Shoes (₹179.99)
- Luxury Skincare Set (₹225.00)
- Yoga Mat Premium (₹79.99)

---

## 🛠️ npm Scripts

```bash
npm start      # Production server
npm run dev    # Development server (nodemon)
npm run seed   # Seed database
```

---

## 🔍 Testing Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@luxe.com","password":"admin123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products?page=1&limit=10
```

### Search Products
```bash
curl 'http://localhost:5000/api/products?search=headphones'
```

---

## 🌐 Health Check

```bash
curl http://localhost:5000/health
```

---

## 📁 Important Files

- `.env` - Environment configuration
- `src/server.js` - Main server file
- `src/models/` - Database schemas
- `src/controllers/` - Business logic
- `src/routes/` - API routes
- `src/middleware/` - Auth, validation, etc.

---

## ⚠️ Common Issues

### MongoDB Connection Failed
- Check `MONGODB_URI` in `.env`
- Verify IP whitelist in MongoDB Atlas
- Confirm database credentials

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process on port 5000

### JWT Errors
- Verify `JWT_SECRET` is set
- Check token format in Authorization header

---

## 📚 Full Documentation

See `README.md` for complete API documentation.
