import express from 'express';
import { verifyBuyerOrAdmin, verifyVendorOrAdmin } from '../middleware/roles.js';
import { verifyToken } from '../middleware/auth.js';
import { 
  createOrder, 
  getVendorOrders, 
  getBuyerOrders, 
  updateOrderStatus, 
  getOrderById 
} from '../controllers/orderController.js';

const router = express.Router();

// 1. Create Order (Buyer or Admin)
// ALWAYS put verifyToken FIRST
router.post('/create', verifyToken, verifyBuyerOrAdmin, createOrder);

// 2. Get Orders for Vendor
router.get('/vendor', verifyToken, verifyVendorOrAdmin, getVendorOrders);

// 3. Get Orders for Buyer
router.get('/buyer', verifyToken, verifyBuyerOrAdmin, getBuyerOrders);

// 4. Update Order Status (Vendor)
router.patch('/:id/status', verifyToken, verifyVendorOrAdmin, updateOrderStatus);

// 5. Get Single Order
router.get('/:id', verifyToken, getOrderById);

export default router;