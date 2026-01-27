import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Link to the Vendor's Business Profile (not just the User account)
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true 
  },
  
  // Basic Info
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  unit: { type: String, default: 'unit' },
  
  // Trade Logistics
  moq: { type: Number, default: 1 },
  leadTime: { type: String },
  location: { type: String },
  
  // Media
  images: [{ type: String }], // Array for multiple image URLs
  
  // Pricing Tiers (Bulk Discounts)
  tiers: [{
    minQty: { type: Number },
    price: { type: Number },
    label: { type: String } // e.g., "Starter", "Business", "Enterprise"
  }],
  
  // Inventory & Dashboard Management
  stock: { type: String }, 
  price: { type: Number }, // Changed to Number for calculation; formatting happens in Frontend
  stockValue: { type: Number, default: 100 },
  status: { type: String, default: 'In Stock' },
  
  // Specifications (Restored from your detailed requirement)
  specifications: [{
    key: String,   // e.g., "Material"
    value: String  // e.g., "100% Organic Cotton"
  }]

}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);