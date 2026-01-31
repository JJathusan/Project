import Vendor from '../models/Vendor.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/roles.js';
import { verifyToken } from '../middleware/auth.js';
import { rejectVendor } from '../controllers/adminController.js';

const router = express.Router();

// Create new user (Admin only)
router.post('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    if (!['buyer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'buyer', 'vendor', or 'admin'" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: companyName || ''
    });

    await newUser.save();

    const userResponse = await User.findById(newUser._id).select('-password');

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (vendors and buyers)
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users by role
router.get('/users/:role', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { role } = req.params;
    if (!['buyer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single user by ID
router.get('/users/id/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.patch('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, companyName, role } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (role && ['buyer', 'vendor', 'admin'].includes(role)) updateData.role = role;

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    res.json({
      totalUsers,
      totalVendors,
      totalBuyers,
      totalAdmins
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/verify-vendor/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedVendor = await Vendor.findOneAndUpdate(
      { user: req.params.id }, 
      { status: 'verified' },
      { new: true }
    );
    if (!updatedVendor) return res.status(404).json({ message: "Vendor profile not found" });
    res.json({ message: "Vendor verified successfully", vendor: updatedVendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Pending OR Rejected Vendors so Admin can see them
router.get('/vendors/pending', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // FIX: Include 'rejected' in the search so they don't disappear from the dashboard
    const pendingVendors = await Vendor.find({ 
      status: { $in: ['pending', 'rejected'] } 
    }).populate('user', 'name email');
    
    res.json(pendingVendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FIX: Changed 'isAdmin' to 'verifyAdmin' to match your imports
router.patch('/reject-vendor/:userId', verifyToken, verifyAdmin, rejectVendor);

export default router;