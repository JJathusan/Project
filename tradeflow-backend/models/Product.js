import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  unit: { type: String, default: 'unit' },
  moq: { type: Number, default: 1 },
  leadTime: { type: String },
  location: { type: String },
  images: [{ type: String }], // Array for multiple image URLs
  tiers: [{
    minQty: Number,
    price: Number,
    label: String
  }],
  // Fields for the inventory list
  stock: { type: String }, 
  price: { type: String }, // Display price (e.g., "$8.50/m")
  stockValue: { type: Number, default: 100 },
  status: { type: String, default: 'In Stock' },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);