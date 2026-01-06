import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  Clock, 
  FileText, 
  MessageSquare,
  Truck,
  CheckCircle,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const navigate = useNavigate();

  // Integrated Mock Data
  const product = {
    name: "Premium Cotton Fabric",
    category: "Textiles",
    unit: "meter",
    moq: 500,
    leadTime: "15-20 days",
    location: "Vietnam",
    vendor: "Global Tex Co.",
    rating: 4.8,
    description: "High-grade 100% organic cotton fabric suitable for industrial garment production. Double-combed for extra softness and durability. Breathable, hypoallergenic, and ethically sourced.",
    tiers: [
      { minQty: 500, price: 8.50, label: "Starter" },
      { minQty: 2000, price: 7.25, label: "Business" },
      { minQty: 5000, price: 6.10, label: "Enterprise" },
    ]
  };

  // State for Calculator
  const [quantity, setQuantity] = useState(product.moq);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentUnitPrice, setCurrentUnitPrice] = useState(product.tiers[0].price);

  // Logic to update price based on quantity
  useEffect(() => {
    const applicableTier = [...product.tiers]
      .reverse()
      .find(tier => quantity >= tier.minQty) || product.tiers[0];

    setCurrentUnitPrice(applicableTier.price);
    setTotalPrice(quantity * applicableTier.price);
  }, [quantity]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-blue-600 transition text-sm font-medium group"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Specifications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
               <span className="text-slate-400 font-bold text-2xl">Product Image Gallery</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
                {product.category}
              </span>
              <div className="flex items-center text-slate-500 text-sm">
                <Globe size={14} className="mr-1" /> Origin: {product.location}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">Specifications</h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Clock size={20} /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Manufacturing Lead Time</p>
                    <p className="text-sm font-bold text-slate-700">{product.leadTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Quality Standard</p>
                    <p className="text-sm font-bold text-slate-700">ISO 9001:2015 Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Calculator & Purchase */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Order Calculator</h3>
            
            {/* Quantity Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Enter Quantity ({product.unit}s)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min={product.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <Package className="absolute right-4 top-3.5 text-slate-300" size={20} />
              </div>
              {quantity < product.moq && (
                <p className="text-red-500 text-[10px] mt-1 font-bold">Minimum order: {product.moq} {product.unit}s</p>
              )}
            </div>

            {/* Total Price Display */}
            <div className="bg-slate-900 rounded-2xl p-5 mb-6 text-white shadow-xl shadow-slate-200">
              <div className="flex justify-between items-center mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Unit Price</span>
                <span className="text-white">${currentUnitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                <span className="text-sm font-medium text-slate-300">Total Est.</span>
                <span className="text-2xl font-black text-blue-400">
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Tier Highlights */}
            <div className="space-y-2 mb-8">
               <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Available Volume Discounts</p>
               {product.tiers.map((tier, index) => {
                 const isActive = quantity >= tier.minQty && (index === product.tiers.length - 1 || quantity < product.tiers[index + 1].minQty);
                 return (
                   <div key={index} className={`flex justify-between items-center text-xs p-3 rounded-xl border transition-all ${isActive ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200 shadow-sm' : 'border-slate-50 text-slate-500'}`}>
                     <div className="flex flex-col">
                        <span className="font-black">{tier.label}</span>
                        <span>{tier.minQty}+ {product.unit}s</span>
                     </div>
                     <span className="text-sm font-bold">${tier.price.toFixed(2)}</span>
                   </div>
                 )
               })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                disabled={quantity < product.moq}
                className="w-full bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                Start Purchase Order <CheckCircle size={18} />
              </button>
              <button className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2">
                Request a Quote <FileText size={18} />
              </button>
              <button className="w-full text-slate-500 py-2 rounded-xl font-bold hover:text-blue-600 transition text-sm flex items-center justify-center gap-2">
                <MessageSquare size={16} /> Contact Vendor
              </button>
            </div>

            {/* Trust Footer */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <Truck size={14} className="text-blue-500" />
                <span>Shipping from <strong>{product.location}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>TradeFlow Buyer Protection Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}