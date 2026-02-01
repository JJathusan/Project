import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose'; // ADDED: Required for mongoose.model calls
import { verifyVendorOrAdmin } from '../middleware/roles.js';
import { verifyToken, isVerifiedVendor } from '../middleware/auth.js'; 
import { setupVendorProfile, getVendorStats } from '../controllers/vendorController.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import Order from '../models/Order.js'; // ADDED: Direct import is safer for the admin route

const router = express.Router();

// --- 1. Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- 2. Dashboard Stats ---
router.get('/stats', verifyToken, verifyVendorOrAdmin, getVendorStats);

// --- 3. Vendor Profile Setup ---
router.post('/setup', verifyToken, verifyVendorOrAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'businessLicense', maxCount: 1 }
]), setupVendorProfile);

// --- 4. Inventory Management ---

// GET Full Inventory
router.get('/inventory', verifyToken, verifyVendorOrAdmin, isVerifiedVendor, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// POST Add Product
router.post('/add-product', verifyToken, verifyVendorOrAdmin, isVerifiedVendor, upload.array('images', 5), async (req, res) => {
  try {
    const { name, category, price, moq, specifications, ...rest } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, Category, and Price are required." });
    }

    const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newProduct = new Product({
      ...rest,
      name,
      category,
      price: numericPrice,
      moq: Number(moq) || 1,
      vendor: req.user.id,
      status: "In Stock",
      stockValue: 100,
      images: imagePaths,
      specifications: specifications ? JSON.parse(specifications) : [],
      tiers: rest.tiers || [{ minQty: Number(moq) || 1, price: numericPrice, label: "Standard" }]
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

// DELETE Product
router.delete('/product/:id', verifyToken, verifyVendorOrAdmin, isVerifiedVendor, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// --- 5. Profile Management ---
router.get('/profile', verifyToken, verifyVendorOrAdmin, async (req, res) => {
  try {
    const profile = await Vendor.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// --- Admin Only: Get Full Vendor Details for Dashboard ---
router.get('/admin/detail/:vendorId', verifyToken, async (req, res) => {
  try {
    // 1. Check if the requester is an Admin
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin access required" });

    const vendorId = req.params.vendorId;

    // 2. Fetch all data related to this vendor
    const [profile, products, orders] = await Promise.all([
      Vendor.findOne({ user: vendorId }).populate('user', 'name email'),
      Product.find({ vendor: vendorId }),
      Order.find({ vendor: vendorId }).populate('buyer', 'name email').sort({ createdAt: -1 })
    ]);

    // 3. Calculate Total Sales (Safe check for totalPrice)
    const totalSales = orders
      .filter(o => o.status === 'delivered' || o.status === 'confirmed')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    res.json({
      profile,
      products,
      orders,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalSales
      }
    });
  } catch (err) {
    console.error("Admin Detailed Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
}); 

export default router;