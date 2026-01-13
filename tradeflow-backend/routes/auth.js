import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 1. SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    
    // Validate role is buyer, vendor, or admin
    if (role && !['buyer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'buyer', 'vendor', or 'admin'" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'buyer', // Default to buyer if not specified
      companyName 
    });

    await newUser.save();
    
    // Return user info so frontend can use the name immediately
    res.status(201).json({ 
      message: "User created successfully",
      user: { name, role } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Validate if logging into correct portal (Vendor vs Buyer)
    if (role && user.role !== role) {
      return res.status(403).json({ 
        message: `Access denied. You are trying to log into the ${role} portal with a ${user.role} account.` 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'YOUR_SECRET_KEY', 
      { expiresIn: '1d' }
    );

    // FIX: Send a structured response that matches your Frontend Navbar logic
    res.json({ 
      token, 
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        companyName: user.companyName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET PROFILE (Get current user profile)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE PROFILE
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, companyName } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (companyName !== undefined) updateData.companyName = companyName;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        companyName: updatedUser.companyName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. UPDATE PASSWORD
router.patch('/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;