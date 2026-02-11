# Luxe E-Commerce Backend

Complete Node.js/Express backend for the Luxe premium e-commerce application.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (Customer/Admin)
  - Secure password hashing with bcrypt
  - Protected routes middleware

- **Product Management**
  - Advanced filtering, search, and pagination
  - Category-based organization
  - Featured products and bestsellers
  - Stock management
  - Product reviews and ratings

- **Shopping Experience**
  - Shopping cart with real-time stock validation
  - Wishlist functionality
  - Order creation and tracking
  - Auto-calculated taxes and shipping

- **User Management**
  - User profiles
  - Multiple shipping addresses
  - Order history
  - Secure password management

- **Security**
  - Helmet.js for security headers
  - Rate limiting for API endpoints
  - CORS configuration
  - Input validation and sanitization
  - MongoDB injection prevention

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **File Upload:** Multer + Cloudinary
- **Security:** Helmet, CORS, bcrypt, express-rate-limit

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Steps

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   NODE_ENV=development
   PORT=5000

   # MongoDB Atlas connection string
   MONGODB_URI=your-mongodb-uri

   # JWT secrets
   JWT_SECRET=your-secure-jwt-secret-key
   JWT_EXPIRE=15m
   REFRESH_TOKEN_SECRET=your-secure-refresh-token-secret
   REFRESH_TOKEN_EXPIRE=7d

   # Cloudinary credentials
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Frontend URL
   FRONTEND_URL=http://localhost:8080
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary config
│   │
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Category.js          # Category schema
│   │   ├── Order.js             # Order schema
│   │   └── Review.js            # Review schema
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product operations
│   │   ├── cartController.js    # Cart management
│   │   ├── orderController.js   # Order processing
│   │   ├── userController.js    # User management
│   │   └── reviewController.js  # Review system
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── reviews.js
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── admin.js             # Admin role check
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── validator.js         # Input validation
│   │   ├── upload.js            # File upload (Multer)
│   │   └── rateLimiter.js       # Rate limiting
│   │
│   ├── utils/
│   │   ├── jwt.js               # JWT helpers
│   │   ├── passwordHash.js      # Password hashing
│   │   ├── ApiResponse.js       # Response formatter
│   │   └── ApiError.js          # Custom error class
│   │
│   ├── validators/
│   │   └── authValidators.js    # Auth validation rules
│   │
│   ├── seed/
│   │   └── seedData.js          # Database seeding
│   │
│   └── server.js                # Express app entry point
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| POST | `/refresh-token` | Refresh access token | Private |
| GET | `/me` | Get current user | Private |
| PUT | `/change-password` | Change password | Private |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List products (filterable) | Public |
| GET | `/featured` | Get featured products | Public |
| GET | `/bestsellers` | Get bestsellers | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

**Query Parameters for GET /:**
- `page`, `limit` - Pagination
- `category` - Filter by category slug
- `brand` - Filter by brand
- `minPrice`, `maxPrice` - Price range
- `tags` - Filter by tags
- `search` - Search query
- `sort` - Sort field (e.g., -createdAt, price)

### Categories (`/api/categories`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all categories | Public |
| GET | `/:slug` | Get category by slug | Public |
| POST | `/` | Create category | Admin |
| PUT | `/:id` | Update category | Admin |
| DELETE | `/:id` | Delete category | Admin |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user cart | Private |
| POST | `/` | Add item to cart | Private |
| PUT | `/:itemId` | Update cart item | Private |
| DELETE | `/:itemId` | Remove item | Private |
| DELETE | `/` | Clear cart | Private |

### Wishlist (`/api/wishlist`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user wishlist | Private |
| POST | `/:productId` | Add to wishlist | Private |
| DELETE | `/:productId` | Remove from wishlist | Private |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user orders | Private |
| GET | `/:id` | Get order details | Private |
| POST | `/` | Create order | Private |

### Reviews (`/api/reviews`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products/:productId` | Get product reviews | Public |
| POST | `/products/:productId` | Add review | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update profile | Private |
| POST | `/addresses` | Add address | Private |
| PUT | `/addresses/:id` | Update address | Private |
| DELETE | `/addresses/:id` | Delete address | Private |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** - Receive access token (15min) and refresh token (7 days)
2. **Access Protected Routes** - Send access token in Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Refresh Token** - Use refresh token to get new access token when expired

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🗄️ Database Models

- **User** - User accounts with cart and wishlist
- **Product** - Product catalog with images, pricing, stock
- **Category** - Product categories
- **Order** - Customer orders with items and addresses
- **Review** - Product reviews and ratings

## 🛡️ Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **Helmet.js** for security headers
- **CORS** configuration
- **Input Validation** using express-validator
- **MongoDB Injection** prevention
-**Role-Based Access Control** (Customer/Admin)

## 🧪 Testing the API

You can test the API using:
- **Postman** - Import the routes and test
- **Thunder Client** (VS Code extension)
- **cURL** commands

Example cURL request:
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

### MongoDB Atlas Setup
1. Create a cluster on MongoDB Atlas
2. Create a database user
3. Whitelist your IP address (or 0.0.0.0/0 for all)
4. Get the connection string
5. Replace `<username>`, `<password>`, and database name in `MONGODB_URI`

### Cloudinary Setup
1. Sign up for Cloudinary account
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env` file

### Production Deployment
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Enable HTTPS
- Consider using PM2 for process management

## 📄 Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT secret key | Yes |
| REFRESH_TOKEN_SECRET | Refresh token secret | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |

## 📚 Next Steps

1. ✅ Backend API is ready
2. 🔄 Seed database with initial data
3. 🔄 Connect frontend to backend
4. 🔄 Add payment gateway (Stripe/PayPal)
5. 🔄 Implement email notifications
6. 🔄 Deploy to production

## 📞 Support

For issues or questions, please check the documentation or create an issue.

---

**Built with ❤️ for Luxe E-Commerce**
