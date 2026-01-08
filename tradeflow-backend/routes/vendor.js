import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 1. GET Dashboard Stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    const inventoryHealth = products.map(p => ({
      name: p.name,
      health: p.stockValue || 100,
      status: p.status
    }));

    res.json({
      revenue: "$42,850",
      activeQuotes: 18,
      pendingShipments: 7,
      newRFQs: 24,
      inventoryHealth: inventoryHealth
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET Full Inventory
router.get('/inventory', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST Add Product
router.post('/add-product', verifyToken, async (req, res) => {
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

// 4. DELETE Product
router.delete('/product/:id', verifyToken, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PATCH (Update) Product
router.patch('/product/:id', verifyToken, async (req, res) => {
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