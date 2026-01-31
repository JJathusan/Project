import Vendor from '../models/Vendor.js';
import User from '../models/User.js';

export const rejectVendor = async (req, res) => {
  try {
    // FIX: Change this to userId to match your route definition
    const { userId } = req.params; 

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: "Invalid User ID provided" });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { user: userId },
      { status: 'rejected' },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    await User.findByIdAndUpdate(userId, { isProfileSetup: false });

    res.json({ success: true, message: "Vendor application rejected" });
  } catch (err) {
    console.error("Rejection Error:", err);
    res.status(500).json({ error: err.message });
  }
};