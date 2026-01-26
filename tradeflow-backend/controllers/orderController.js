import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create New Order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, unitPrice, shippingAddress } = req.body;
    const buyerId = req.user.id;

    // Find product and ensure vendor info is available
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const totalPrice = Number(quantity) * Number(unitPrice);

    const order = new Order({
      buyer: buyerId,
      vendor: product.vendor, // Assuming product.vendor stores the ID
      product: productId,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalPrice: totalPrice,
      shippingAddress: {
        street: shippingAddress?.street || "",
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        country: shippingAddress?.country || "",
        zipCode: shippingAddress?.zipCode || ""
      },
      status: 'confirmed'
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'name category images')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get Vendor Orders
export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .populate('product', 'name category images')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Buyer Orders
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('product', 'name category images')
      .populate('vendor', 'name companyName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier, estimatedDelivery } = req.body;
    const order = await Order.findOne({ _id: req.params.id, vendor: req.user.id });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    await order.save();
    const populatedOrder = await Order.findById(order._id)
      .populate('product', 'name category')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName');

    res.json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name category images description')
      .populate('buyer', 'name email')
      .populate('vendor', 'name companyName email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.buyer._id.toString() !== req.user.id && order.vendor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};