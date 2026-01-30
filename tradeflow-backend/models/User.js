// tradeflow-backend/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'vendor', 'admin'], required: true },
  // ADD THIS LINE:
  companyName: { type: String }, 
  vendorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isProfileSetup: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);