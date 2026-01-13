import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number },
  totalPrice: { type: Number },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'quoted', 'negotiating', 'accepted', 'declined', 'expired'],
    default: 'pending' 
  },
  vendorResponse: { type: String },
  vendorPrice: { type: Number },
  expiresAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Quote', QuoteSchema);
