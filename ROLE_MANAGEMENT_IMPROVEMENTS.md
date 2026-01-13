# Role-Based Access Control Improvements

## Summary

Your original implementation had some security gaps. I've improved it to follow industry best practices for role-based access control (RBAC).

## Issues Fixed

### ❌ Before (Issues)

1. **Admin Creation Vulnerability**
   - Anyone could create admin accounts through signup endpoint
   - No protection against privilege escalation

2. **Missing Role Verification**
   - Vendor routes only checked token, not role
   - Buyer routes only checked token, not role
   - Admin routes had verification, but inconsistent pattern

3. **Inconsistent Middleware**
   - No reusable role verification utilities
   - Each route handled authorization differently

4. **Frontend-Only Protection**
   - ProtectedRoute relied on localStorage (can be manipulated)
   - No backend validation for many routes

### ✅ After (Fixed)

1. **Admin Account Protection**
   ```javascript
   // Signup endpoint now rejects admin role
   if (role === 'admin') {
     return res.status(403).json({ 
       message: "Admin accounts cannot be created through this endpoint" 
     });
   }
   ```

2. **Comprehensive Role Verification**
   - Created centralized `middleware/roles.js` with reusable functions
   - All vendor routes now use `verifyVendor`
   - All buyer routes now use `verifyBuyer`
   - All admin routes use `verifyAdmin`

3. **Consistent Middleware Pattern**
   ```javascript
   // Generic role verifier
   export const verifyRole = (allowedRoles) => { ... }
   
   // Specific role verifiers
   export const verifyVendor = verifyRole(['vendor']);
   export const verifyBuyer = verifyRole(['buyer']);
   export const verifyAdmin = verifyRole(['admin']);
   ```

4. **Backend-First Security**
   - Every protected route validates role on backend
   - Frontend protection is UX layer only
   - Backend is source of truth

## Architecture

### Middleware Stack

```
Request → verifyToken → verifyRole → Route Handler
           ↓              ↓
        Validates      Checks if user
        JWT token      has required role
```

### File Structure

```
middleware/
  ├── auth.js          # Token verification
  ├── roles.js         # Role-based access control (NEW)
  └── admin.js         # Deprecated (uses roles.js)

routes/
  ├── auth.js          # Signup/login (admin protection added)
  ├── admin.js         # Admin routes (uses verifyAdmin)
  ├── vendor.js        # Vendor routes (uses verifyVendor)
  ├── orders.js        # Order routes (uses verifyBuyer/verifyVendor)
  └── quotes.js        # Quote routes (uses verifyBuyer/verifyVendor)
```

## Security Layers

### Layer 1: Frontend (UX)
- `ProtectedRoute` component checks localStorage
- Redirects users to appropriate dashboards
- **Can be bypassed** - this is intentional for UX

### Layer 2: Backend (Security)
- JWT token verification
- Role validation on every request
- **Cannot be bypassed** - this is the security layer

### Example Flow

```
User tries to access /api/vendor/stats
  ↓
Frontend: Checks localStorage role → "buyer"
  ↓ (User manipulates localStorage to "vendor")
Frontend: Allows access (UX layer)
  ↓
Backend: Receives request with JWT token
  ↓
Backend: Verifies token → extracts role → "buyer"
  ↓
Backend: Checks verifyVendor middleware → FAILS
  ↓
Backend: Returns 403 Forbidden
```

## Usage Examples

### Protecting Routes

```javascript
// Single role
router.get('/vendor/stats', verifyVendor, handler);
router.post('/quotes/request', verifyBuyer, handler);
router.get('/admin/users', verifyAdmin, handler);

// Multiple roles
router.get('/products', verifyVendorOrAdmin, handler);
router.get('/orders', verifyBuyerOrAdmin, handler);

// Custom roles
router.get('/special', verifyRole(['vendor', 'admin']), handler);
```

## Testing

### Test Admin Protection
```bash
# Try to create admin through signup (should fail)
POST /api/auth/signup
{ "role": "admin", ... }
# Response: 403 Forbidden

# Create admin through script (should work)
npm run create-admin
```

### Test Role Verification
```bash
# Login as buyer
POST /api/auth/login
{ "email": "buyer@example.com", "role": "buyer" }

# Try to access vendor route (should fail)
GET /api/vendor/stats
Headers: { Authorization: "Bearer <buyer-token>" }
# Response: 403 Forbidden
```

## Best Practices Followed

✅ **Principle of Least Privilege**
- Users only get access to what they need
- Admin accounts require special creation

✅ **Defense in Depth**
- Multiple security layers
- Frontend UX + Backend validation

✅ **Fail Secure**
- Default to denying access
- Explicitly allow only what's needed

✅ **Separation of Concerns**
- Reusable middleware functions
- Clear separation between auth and authorization

✅ **Backend Validation**
- Never trust frontend
- Always validate on server

## Migration Notes

- Existing code continues to work
- Old `admin.js` middleware still works (backward compatible)
- No breaking changes to API
- All routes now properly protected

## Next Steps (Optional Enhancements)

1. **Rate Limiting**: Add rate limiting to prevent brute force
2. **Audit Logging**: Log all admin actions
3. **Token Refresh**: Implement refresh token mechanism
4. **Role Permissions**: More granular permissions system
5. **Multi-factor Auth**: Add 2FA for admin accounts
