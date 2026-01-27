import { verifyToken } from './auth.js';

export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    // 1. Normalize the user's role from the token
    const userRole = req.user.role ? req.user.role.toLowerCase().trim() : "";
    
    // 2. Normalize the allowed roles array
    const roles = allowedRoles.map(r => r.toLowerCase().trim());

    // --- CRITICAL DEBUG LOG ---
    // Check your BACKEND terminal for this output!
    console.log(`[ACL Check] User Role: "${userRole}" | Allowed: [${roles.join(', ')}]`);

    if (roles.includes(userRole)) {
      next();
    } else {
      // If this fires, it means the role in the token is NOT "buyer" or "admin"
      res.status(403).json({ 
        message: `Forbidden: Access denied for role [${req.user.role}]`,
        required: allowedRoles 
      });
    }
  };
};

export const verifyVendorOrAdmin = verifyRole(['vendor', 'admin']);
export const verifyBuyerOrAdmin = verifyRole(['buyer', 'admin']);
export const verifyAdmin = verifyRole(['admin']);