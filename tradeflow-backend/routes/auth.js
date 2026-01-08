import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 1. SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
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

export default router;