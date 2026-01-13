import express from 'express';
import Quote from '../models/Quote.js';
import Product from '../models/Product.js';
import { verifyBuyerOrAdmin, verifyVendorOrAdmin } from '../middleware/roles.js';

const router = express.Router();

// 1. Create Quote Request (Buyer or Admin)
router.post('/request', verifyBuyerOrAdmin, async (req, res) => {
  try {
    const { productId, quantity, message } = req.body;
    const buyerId = req.user.id;

    const product = await Product.findById(productId).populate('vendor');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const quote = new Quote({
      buyer: buyerId,
      vendor: product.vendor,
      product: productId,
      quantity,
      message,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await quote.save();
    const populatedQuote = await Quote.findById(quote._id)
      .populate('product', 'name category')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.status(201).json(populatedQuote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Quotes for Vendor (Vendor or Admin)
router.get('/vendor', verifyVendorOrAdmin, async (req, res) => {
  try {
    const quotes = await Quote.find({ vendor: req.user.id })
      .populate('product', 'name category images')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Quotes for Buyer (Buyer or Admin)
router.get('/buyer', verifyBuyerOrAdmin, async (req, res) => {
  try {
    const quotes = await Quote.find({ buyer: req.user.id })
      .populate('product', 'name category images')
      .populate('vendor', 'name companyName')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Respond to Quote (Vendor or Admin)
router.patch('/:id/respond', verifyVendorOrAdmin, async (req, res) => {
  try {
    const { vendorPrice, vendorResponse, status } = req.body;
    const quote = await Quote.findOne({ _id: req.params.id, vendor: req.user.id });
    
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    quote.vendorPrice = vendorPrice;
    quote.vendorResponse = vendorResponse;
    quote.status = status || 'quoted';
    
    if (vendorPrice && quote.quantity) {
      quote.totalPrice = vendorPrice * quote.quantity;
    }

    await quote.save();
    const populatedQuote = await Quote.findById(quote._id)
      .populate('product', 'name category')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.json(populatedQuote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Accept Quote (Buyer or Admin) - Creates Order
router.post('/:id/accept', verifyBuyerOrAdmin, async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, buyer: req.user.id });
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (quote.status !== 'quoted') {
      return res.status(400).json({ message: 'Quote is not in quoted status' });
    }

    quote.status = 'accepted';
    await quote.save();

    // Create order from quote
    const Order = (await import('../models/Order.js')).default;
    const order = new Order({
      buyer: quote.buyer,
      vendor: quote.vendor,
      product: quote.product,
      quote: quote._id,
      quantity: quote.quantity,
      unitPrice: quote.vendorPrice || 0,
      totalPrice: quote.totalPrice || (quote.vendorPrice * quote.quantity),
      status: 'confirmed'
    });

    await order.save();
    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'name category')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.status(201).json({ order: populatedOrder, quote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
