import { verifyToken } from './auth.js';

/**
 * Middleware to verify user has a specific role
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
        });
      }
      next();
    });
  };
};

/**
 * Middleware to verify user is a vendor
 */
export const verifyVendor = verifyRole(['vendor']);

/**
 * Middleware to verify user is a buyer
 */
export const verifyBuyer = verifyRole(['buyer']);

/**
 * Middleware to verify user is an admin
 */
export const verifyAdmin = verifyRole(['admin']);

/**
 * Middleware to verify user is either vendor or admin
 */
export const verifyVendorOrAdmin = verifyRole(['vendor', 'admin']);

/**
 * Middleware to verify user is either buyer or admin
 */
export const verifyBuyerOrAdmin = verifyRole(['buyer', 'admin']);
