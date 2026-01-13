# Security & Role-Based Access Control (RBAC) Documentation

## Overview
This document explains the role-based access control system implemented in TradeFlow.

## Roles

### 1. **Admin**
- **Access**: Full system access
- **Can**: Manage all users (vendors & buyers), view statistics, access admin dashboard
- **Cannot**: Create products, place orders, create quotes
- **Creation**: Only through admin script (`npm run create-admin`), NOT through signup endpoint

### 2. **Vendor**
- **Access**: Vendor portal and vendor-specific resources
- **Can**: Manage inventory, respond to quotes, manage orders, view vendor dashboard
- **Cannot**: Create orders as buyer, access admin panel
- **Creation**: Through `/api/auth/signup` with `role: "vendor"`

### 3. **Buyer**
- **Access**: Buyer portal and buyer-specific resources
- **Can**: Browse marketplace, create orders, request quotes, view buyer dashboard
- **Cannot**: Manage inventory, respond to quotes, access vendor/admin panels
- **Creation**: Through `/api/auth/signup` with `role: "buyer"` (or default)

## Security Implementation

### Backend Security (Source of Truth)

#### Middleware Stack
1. **`verifyToken`** - Verifies JWT token and extracts user info
2. **`verifyRole(allowedRoles)`** - Generic role verification middleware
3. **`verifyAdmin`** - Admin-only access
4. **`verifyVendor`** - Vendor-only access
5. **`verifyBuyer`** - Buyer-only access
6. **`verifyVendorOrAdmin`** - Vendor or Admin access
7. **`verifyBuyerOrAdmin`** - Buyer or Admin access

#### Route Protection Examples

```javascript
// Admin routes
router.get('/admin/users', verifyAdmin, handler);

// Vendor routes
router.get('/vendor/stats', verifyVendor, handler);
router.post('/vendor/add-product', verifyVendor, handler);

// Buyer routes
router.post('/quotes/request', verifyBuyer, handler);
router.get('/orders/buyer', verifyBuyer, handler);
```

### Frontend Security (UX Layer)

**Important**: Frontend protection is for UX only. Backend is the source of truth.

- `ProtectedRoute` component checks localStorage for role
- Redirects users to appropriate dashboards
- Can be bypassed by manipulating localStorage (but backend will reject unauthorized requests)

## Security Best Practices

### ✅ Implemented

1. **Admin Account Protection**
   - Admin accounts cannot be created through signup endpoint
   - Only through secure admin script

2. **Role Validation**
   - All protected routes verify user role on backend
   - JWT tokens include role information
   - Role checked on every request

3. **Password Security**
   - Passwords hashed with bcrypt (salt rounds: 10)
   - Minimum password length enforced

4. **Token Security**
   - JWT tokens expire after 1 day
   - Tokens include user ID and role
   - Secret key stored in environment variables

### ⚠️ Recommendations for Production

1. **Rate Limiting**
   - Add rate limiting to auth endpoints
   - Prevent brute force attacks

2. **Token Refresh**
   - Implement refresh token mechanism
   - Shorter access token expiry

3. **Input Validation**
   - Add input sanitization
   - Validate all user inputs

4. **CORS Configuration**
   - Restrict CORS to specific origins
   - Don't use wildcard (`*`)

5. **HTTPS**
   - Always use HTTPS in production
   - Never send tokens over HTTP

6. **Audit Logging**
   - Log all admin actions
   - Track user activity

## Testing Role Access

### Test Admin Access
```bash
# Login as admin
POST /api/auth/login
{ "email": "admin@example.com", "password": "password", "role": "admin" }

# Access admin route
GET /api/admin/users
Headers: { Authorization: "Bearer <token>" }
```

### Test Vendor Access
```bash
# Login as vendor
POST /api/auth/login
{ "email": "vendor@example.com", "password": "password", "role": "vendor" }

# Access vendor route
GET /api/vendor/stats
Headers: { Authorization: "Bearer <token>" }
```

### Test Buyer Access
```bash
# Login as buyer
POST /api/auth/login
{ "email": "buyer@example.com", "password": "password", "role": "buyer" }

# Access buyer route
GET /api/orders/buyer
Headers: { Authorization: "Bearer <token>" }
```

## Common Security Issues & Solutions

### Issue: User tries to access admin route
**Solution**: Backend returns 403 Forbidden, frontend redirects to appropriate dashboard

### Issue: User tries to create admin through signup
**Solution**: Backend rejects request with 403 Forbidden

### Issue: Token expired
**Solution**: User redirected to login page, must re-authenticate

### Issue: User manipulates localStorage role
**Solution**: Backend validates actual role from JWT token, rejects unauthorized requests
