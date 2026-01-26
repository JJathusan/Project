import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Quote from '../models/Quote.js'; // Added Quote import

/**
 * @desc Get Vendor Dashboard Stats
 * @route GET /api/vendors/stats
 */
export const getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // 1. Get Products for Inventory Health
    const products = await Product.find({ vendor: vendorId });
    const inventoryHealth = products.map(p => ({
      id: p._id, // Adding ID for frontend keys
      name: p.name,
      health: p.stockValue || 100,
      status: p.status
    }));

    // 2. Calculate Revenue (Only from confirmed/delivered orders)
    const orders = await Order.find({ 
      vendor: vendorId,
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // 3. Count Quotes & RFQs
    const activeQuotes = await Quote.countDocuments({ 
      vendor: vendorId,
      status: { $in: ['quoted', 'negotiating'] }
    });

    const newRFQs = await Quote.countDocuments({ 
      vendor: vendorId,
      status: 'pending'
    });

    // 4. Count Pending Shipments
    const pendingShipments = await Order.countDocuments({ 
      vendor: vendorId,
      status: { $in: ['confirmed', 'processing', 'shipped'] }
    });

    res.json({
      revenue: `$${totalRevenue.toLocaleString()}`,
      activeQuotes,
      pendingShipments,
      newRFQs,
      inventoryHealth,
      totalOrders: orders.length // Included for extra dashboard info
    });
  } catch (err) {
    console.error("Stats Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Setup or Update Vendor Profile
 */
export const setupVendorProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { bankDetails, ...rest } = req.body;

    const logoPath = req.files?.logo ? `/uploads/${req.files.logo[0].filename}` : undefined;
    const licensePath = req.files?.businessLicense ? `/uploads/${req.files.businessLicense[0].filename}` : undefined;

    let parsedBank = {};
    if (bankDetails) {
        try {
            parsedBank = typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails;
        } catch (e) { console.error("Bank parsing error", e); }
    }

    const vendorData = {
      ...rest,
      user: userId,
      bankDetails: parsedBank
    };
    if (logoPath) vendorData.logo = logoPath;
    if (licensePath) vendorData.businessLicenseUrl = licensePath;

    const vendor = await Vendor.findOneAndUpdate(
      { user: userId },
      { $set: vendorData },
      { new: true, upsert: true } 
    );

    await User.findByIdAndUpdate(userId, { isProfileSetup: true });

    res.status(201).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};