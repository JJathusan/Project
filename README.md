# TradeFlow - B2B Marketplace Platform

A modern B2B marketplace platform for SMEs to source, negotiate, and ship bulk goods with enterprise-grade security.

## Features

### Buyer Features
- Browse marketplace with search and filtering
- View detailed product information with dynamic pricing tiers
- Request quotes from vendors
- Create purchase orders directly
- Track RFQs and orders
- Secure authentication

### Vendor Features
- Vendor dashboard with analytics
- Inventory management (add, edit, delete products)
- Respond to quote requests
- Manage sales orders
- Update order status and tracking information
- Real-time quote and order tracking

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd tradeflow-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `tradeflow-backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/tradeflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the root directory (if not already there):
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

## Project Structure

```
Project-main/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VendorLayout.jsx
│   │   │   └── VendorSidebar.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   └── Card.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── BuyerAuth.jsx
│   │   ├── VendorAuth.jsx
│   │   ├── Marketplace.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── BuyerRFQs.jsx
│   │   ├── BuyerOrders.jsx
│   │   ├── VendorDashboard.jsx
│   │   ├── VendorInventory.jsx
│   │   ├── VendorQuotes.jsx
│   │   └── VendorOrders.jsx
│   ├── App.jsx
│   └── main.jsx
├── tradeflow-backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Quote.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── vendor.js
│   │   ├── quotes.js
│   │   └── orders.js
│   └── server.js
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products/all` - Get all products
- `GET /api/products/:id` - Get single product

### Vendor Routes
- `GET /api/vendor/stats` - Get vendor dashboard stats
- `GET /api/vendor/inventory` - Get vendor inventory
- `POST /api/vendor/add-product` - Add new product
- `PATCH /api/vendor/product/:id` - Update product
- `DELETE /api/vendor/product/:id` - Delete product

### Quotes
- `POST /api/quotes/request` - Create quote request (Buyer)
- `GET /api/quotes/vendor` - Get vendor quotes
- `GET /api/quotes/buyer` - Get buyer quotes
- `PATCH /api/quotes/:id/respond` - Respond to quote (Vendor)
- `POST /api/quotes/:id/accept` - Accept quote (Buyer)

### Orders
- `POST /api/orders/create` - Create order (Buyer)
- `GET /api/orders/vendor` - Get vendor orders
- `GET /api/orders/buyer` - Get buyer orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (Vendor)

## Usage

1. **As a Buyer:**
   - Visit the landing page and click "I'm a Buyer"
   - Sign up or login
   - Browse the marketplace
   - Click on products to view details
   - Request quotes or create purchase orders
   - Track your RFQs and orders from the sidebar

2. **As a Vendor:**
   - Visit the landing page and click "I'm a Vendor"
   - Sign up or login with company details
   - Access the vendor dashboard
   - Add products to inventory
   - Respond to quote requests
   - Manage and update order statuses

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Development

- Backend uses nodemon for auto-restart during development
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Both servers should run simultaneously for full functionality

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Protected routes require valid tokens
- Role-based access control for vendor/buyer separation

## License

This project is private and proprietary.
