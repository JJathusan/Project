import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Check if a vendor profile exists in the DB
    const vendorProfile = await Vendor.findOne({ user: user._id });

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // 5. Return user data with companyName and setup flag
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName || "Not set",
        // true if vendorProfile exists AND is fully setup
        isProfileSetup: !!vendorProfile && vendorProfile.status !== 'pending'
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    // 1. Save to User Table (Including companyName for denormalization)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: role === 'vendor' ? companyName : undefined 
    });

    const savedUser = await newUser.save();

    // 2. Save to Vendor Table (Initial Profile)
    if (role === 'vendor') {
      const newVendor = new Vendor({
        user: savedUser._id,
        companyName: companyName, // Saved here too
        status: 'pending'
      });
      const savedVendor = await newVendor.save();
      
      // Link the profile back to user
      savedUser.vendorProfile = savedVendor._id;
      await savedUser.save();
    }

    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// GET PROFILE CONTROLLER (Used by VendorProfile.jsx)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName || "Not set"
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};