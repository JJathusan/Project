import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { verifyVendorOrAdmin } from '../middleware/roles.js';

const router = express.Router();

// 1. GET Dashboard Stats (Vendor or Admin)
router.get('/stats', verifyVendorOrAdmin, async (req, res) => {
  try {
    const Order = (await import('../models/Order.js')).default;
    const Quote = (await import('../models/Quote.js')).default;
    
    const products = await Product.find({ vendor: req.user.id });
    const inventoryHealth = products.map(p => ({
      name: p.name,
      health: p.stockValue || 100,
      status: p.status
    }));

    // Calculate real revenue from orders
    const orders = await Order.find({ 
      vendor: req.user.id,
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Get active quotes count
    const activeQuotes = await Quote.countDocuments({ 
      vendor: req.user.id,
      status: { $in: ['quoted', 'negotiating'] }
    });

    // Get pending shipments count
    const pendingShipments = await Order.countDocuments({ 
      vendor: req.user.id,
      status: { $in: ['confirmed', 'processing', 'shipped'] }
    });

    // Get new RFQs count
    const newRFQs = await Quote.countDocuments({ 
      vendor: req.user.id,
      status: 'pending'
    });

    res.json({
      revenue: `$${totalRevenue.toLocaleString()}`,
      activeQuotes: activeQuotes,
      pendingShipments: pendingShipments,
      newRFQs: newRFQs,
      inventoryHealth: inventoryHealth
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET Full Inventory (Vendor or Admin)
router.get('/inventory', verifyVendorOrAdmin, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST Add Product (Vendor or Admin)
router.post('/add-product', verifyVendorOrAdmin, async (req, res) => {
  try {
    const { name, category, price, moq } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Bad Request: Name, Category, and Price are required." });
    }

    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^0-9.]/g, '')) 
      : price;

    const productData = {
      ...req.body,
      vendor: req.user.id,
      status: "In Stock",
      stockValue: 100,
      tiers: req.body.tiers || [
        { minQty: Number(moq) || 1, price: numericPrice || 0, label: "Standard" }
      ]
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (err) {
    res.status(400).json({ message: "Database Validation Error", error: err.message });
  }
});

// --- MOVED OUTSIDE OF ADD-PRODUCT ---

// 4. DELETE Product (Vendor or Admin)
router.delete('/product/:id', verifyVendorOrAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PATCH (Update) Product (Vendor or Admin)
router.patch('/product/:id', verifyVendorOrAdmin, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;