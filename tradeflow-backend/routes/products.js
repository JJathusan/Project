import express from 'express';
import Product from '../models/Product.js';
import { verifyToken, isVerifiedVendor } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// PUBLIC MARKETPLACE ROUTES (No Token Needed)
// ==========================================

// 1. GET All Products (For the Market page)
// URL: GET /api/products/all
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET Single Product by ID (For the Product Detail page)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor');
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: "Invalid Product ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// VENDOR MANAGEMENT ROUTES (Token & Verification Required)
// ==========================================

// 3. GET Vendor Inventory (Verified check not strictly needed for viewing, but added for safety)
// URL: GET /api/products/inventory
router.get('/inventory', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST Add New Product (LOCKED: Must be Verified)
// URL: POST /api/products/add-product
router.post('/add-product', verifyToken, isVerifiedVendor, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      vendor: req.user.id 
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE a product (LOCKED: Must be Verified)
router.delete('/product/:id', verifyToken, isVerifiedVendor, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. PATCH update a product (LOCKED: Must be Verified)
router.patch('/product/:id', verifyToken, isVerifiedVendor, async (req, res) => {
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