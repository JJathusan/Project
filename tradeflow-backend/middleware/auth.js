import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';

/**
 * @desc Verify JWT Token and attach user to request
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Internal Server Configuration Error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure the decoded token has the expected user information
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token Error:", err.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

/**
 * @desc Middleware to block unverified vendors from specific actions
 * MUST be used after verifyToken
 */
export const isVerifiedVendor = async (req, res, next) => {
  try {
    // 1. Skip check if user is not a vendor (Admins/Buyers bypass this)
    if (req.user.role !== 'vendor') {
      return next();
    }

    // 2. Fetch the vendor profile using the ID from the decoded token
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found. Please complete setup." });
    }

    // 3. Strict check for 'verified' status
    if (vendor.status !== 'verified') {
      return res.status(403).json({ 
        message: "Access Denied: Your vendor account is currently " + vendor.status + ". Product management is locked until admin approval.",
        status: vendor.status 
      });
    }

    // 4. Success - Proceed to the controller
    next();
  } catch (err) {
    console.error("Verification Middleware Error:", err.message);
    res.status(500).json({ message: "Server error during verification check" });
  }
};