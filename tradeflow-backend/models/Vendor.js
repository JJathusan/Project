import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 1. Company Profile
  companyName: { type: String, required: true },
  businessRegNumber: { type: String },
  logo: { type: String }, 
  industry: { type: String },
  description: { type: String },
  yearsInBusiness: { type: Number },
  companySize: { type: String },

  // 2. Contact Details
  contactPerson: { type: String },
  phone: { type: String },
  officeAddress: { type: String },
  country: { type: String },

  // 3. Business & Legal Info
  taxId: { type: String },
  businessLicenseUrl: { type: String },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    swiftCode: String
  },
  certifications: [String],

  // NEW: Verification Status
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },

  // 7. Trust & Performance
  rating: { type: Number, default: 0 },
  responseTime: { type: String, default: "Within 24 hours" },
  fulfillmentRate: { type: Number, default: 100 }

}, { timestamps: true });

export default mongoose.model('Vendor', VendorSchema);