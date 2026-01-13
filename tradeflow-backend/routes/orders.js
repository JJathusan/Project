import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { verifyBuyerOrAdmin, verifyVendorOrAdmin } from '../middleware/roles.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 1. Create Order (Buyer or Admin - Direct Purchase)
router.post('/create', verifyBuyerOrAdmin, async (req, res) => {
  try {
    const { productId, quantity, unitPrice, shippingAddress } = req.body;
    const buyerId = req.user.id;

    const product = await Product.findById(productId).populate('vendor');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const totalPrice = quantity * unitPrice;

    const order = new Order({
      buyer: buyerId,
      vendor: product.vendor._id,
      product: productId,
      quantity,
      unitPrice,
      totalPrice,
      shippingAddress,
      status: 'confirmed'
    });

    await order.save();
    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'name category images')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Orders for Vendor (Vendor or Admin)
router.get('/vendor', verifyVendorOrAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .populate('product', 'name category images')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Orders for Buyer (Buyer or Admin)
router.get('/buyer', verifyBuyerOrAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('product', 'name category images')
      .populate('vendor', 'name companyName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Order Status (Vendor or Admin)
router.patch('/:id/status', verifyVendorOrAdmin, async (req, res) => {
  try {
    const { status, trackingNumber, carrier, estimatedDelivery } = req.body;
    const order = await Order.findOne({ _id: req.params.id, vendor: req.user.id });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    await order.save();
    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'name category')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Single Order
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name category images description')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check if user has access
    if (order.buyer._id.toString() !== req.user.id && order.vendor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
