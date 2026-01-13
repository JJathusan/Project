import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/roles.js';

const router = express.Router();

// Create new user (Admin only)
router.post('/users', verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Validate role
    if (!['buyer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'buyer', 'vendor', or 'admin'" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: companyName || ''
    });

    await newUser.save();

    // Return user without password
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
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users by role
router.get('/users/:role', verifyAdmin, async (req, res) => {
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
router.get('/users/id/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.patch('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, email, companyName, role } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (role && ['buyer', 'vendor', 'admin'].includes(role)) updateData.role = role;

    // Check if email is being changed and if it's already taken
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
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
router.get('/stats', verifyAdmin, async (req, res) => {
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

export default router;
