import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft, ShieldCheck, Globe, Clock, FileText,
  MessageSquare, Truck, CheckCircle, Package, Loader2, X
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentUnitPrice, setCurrentUnitPrice] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");
  const [orderAddress, setOrderAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: ""
  });
  const [processing, setProcessing] = useState(false);

  // 1. Fetch Dynamic Product Data from Backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        // Initialize quantity with the Minimum Order Quantity (MOQ)
        setQuantity(res.data.moq || 1);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // 2. Dynamic Price Calculation Logic
  useEffect(() => {
    if (product && product.tiers && product.tiers.length > 0) {
      // Find the best price tier based on current quantity
      const applicableTier = [...product.tiers]
        .reverse()
        .find(tier => quantity >= tier.minQty) || product.tiers[0];

      setCurrentUnitPrice(applicableTier.price);
      setTotalPrice(quantity * applicableTier.price);
    }
  }, [quantity, product]);

  // 3. Handle Quote Request
  const handleQuoteRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to request a quote");
      navigate("/buyer/login");
      return;
    }

    setProcessing(true);
    try {
      await axios.post(
        "http://localhost:5000/api/quotes/request",
        {
          productId: product._id,
          quantity: quantity,
          message: quoteMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Quote request submitted successfully!");
      setShowQuoteModal(false);
      setQuoteMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit quote request");
    } finally {
      setProcessing(false);
    }
  };

  // 4. Handle Purchase Order
  const handlePurchaseOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a purchase order");
      navigate("/buyer/login");
      return;
    }

    if (!orderAddress.street || !orderAddress.city || !orderAddress.country) {
      alert("Please fill in all required shipping address fields");
      return;
    }

    setProcessing(true);
    try {
      await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          productId: product._id,
          quantity: quantity,
          unitPrice: currentUnitPrice,
          shippingAddress: orderAddress
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Purchase order created successfully!");
      setShowOrderModal(false);
      setOrderAddress({ street: "", city: "", state: "", country: "", zipCode: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create purchase order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing TradeFlow Database...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
      <button onClick={() => navigate("/market")} className="mt-4 text-blue-600 underline">Return to Marketplace</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Navigation */}
      <button
        onClick={() => navigate("/market")}
        className="flex items-center text-slate-500 hover:text-blue-600 transition text-sm font-bold uppercase tracking-widest group"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Media & Specifications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/800x450?text=Product+Image"}
                className="w-full h-full object-cover"
                alt={product.name}
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Globe size={14} className="mr-1 text-blue-600" /> Origin: {product.location || "Global"}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-widest">Specifications & Description</h3>
              <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600"><Clock size={20} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Manufacturing Lead Time</p>
                    <p className="text-sm font-black text-slate-700">{product.leadTime || "Standard (15-20 days)"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quality Standard</p>
                    <p className="text-sm font-black text-slate-700">Verified & ISO Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Calculator & Purchase */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 sticky top-24">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 text-center">Order Calculator</h3>

            {/* Quantity Input */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Enter Quantity ({product.unit}s)</label>
              <div className="relative">
                <input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xl font-black focus:border-blue-600 outline-none transition-all text-slate-900"
                />
                <Package className="absolute right-5 top-4.5 text-slate-300" size={24} />
              </div>
              {quantity < product.moq && (
                <p className="text-red-500 text-[10px] mt-2 font-black uppercase tracking-tighter italic">Minimum order: {product.moq} {product.unit}s</p>
              )}
            </div>

            {/* Total Price Display */}
            <div className="bg-slate-900 rounded-[2rem] p-6 mb-8 text-white shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Current Unit Price</span>
                <span className="text-lg font-black text-white">${currentUnitPrice.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/10 mb-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Est.</span>
                <span className="text-3xl font-black text-blue-400 tracking-tighter">
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Tier Highlights (Restored from Original) */}
            <div className="space-y-2 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Available Volume Discounts</p>
              {product.tiers && product.tiers.map((tier, index) => {
                const isActive = quantity >= tier.minQty && (index === product.tiers.length - 1 || quantity < product.tiers[index + 1].minQty);
                return (
                  <div key={index} className={`flex justify-between items-center text-xs p-3 rounded-xl border transition-all ${isActive ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-sm' : 'border-slate-50 text-slate-500'}`}>
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-tighter">{tier.label || `Tier ${index + 1}`}</span>
                      <span className="font-bold">{tier.minQty}+ {product.unit}s</span>
                    </div>
                    <span className="text-sm font-black">${tier.price.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowOrderModal(true)}
                disabled={quantity < product.moq}
                className="w-full bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
              >
                Start Purchase Order <CheckCircle size={20} />
              </button>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                Request a Quote <FileText size={20} />
              </button>
              <button className="w-full text-slate-500 py-2 rounded-xl font-black hover:text-blue-600 transition text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <MessageSquare size={16} /> Contact Vendor: {product.vendor || 'Authorized Supplier'}
              </button>
            </div>

            {/* Trust Footer (Restored from Original) */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Truck size={16} className="text-blue-500" />
                <span>Shipping from <strong>{product.location}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>TradeFlow Buyer Protection Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Request Quote</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))}
                  min={product.moq}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Message (Optional)</label>
                <textarea
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  placeholder="Add any special requirements or questions..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 h-24 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={handleQuoteRequest}
                disabled={processing || quantity < product.moq}
                className="w-full py-4 bg-blue-600 disabled:bg-slate-100 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
              >
                {processing ? "Submitting..." : "Submit Quote Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Create Purchase Order</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 font-bold">Quantity:</span>
                  <span className="font-black">{quantity} {product.unit}s</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 font-bold">Unit Price:</span>
                  <span className="font-black">${currentUnitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-slate-200">
                  <span className="text-slate-900 font-black">Total:</span>
                  <span className="font-black text-blue-600">${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Street Address *</label>
                <input
                  type="text"
                  value={orderAddress.street}
                  onChange={(e) => setOrderAddress({ ...orderAddress, street: e.target.value })}
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">City *</label>
                  <input
                    type="text"
                    value={orderAddress.city}
                    onChange={(e) => setOrderAddress({ ...orderAddress, city: e.target.value })}
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">State</label>
                  <input
                    type="text"
                    value={orderAddress.state}
                    onChange={(e) => setOrderAddress({ ...orderAddress, state: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Country *</label>
                  <input
                    type="text"
                    value={orderAddress.country}
                    onChange={(e) => setOrderAddress({ ...orderAddress, country: e.target.value })}
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Zip Code</label>
                  <input
                    type="text"
                    value={orderAddress.zipCode}
                    onChange={(e) => setOrderAddress({ ...orderAddress, zipCode: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <button
                onClick={handlePurchaseOrder}
                disabled={processing}
                className="w-full py-4 bg-blue-600 disabled:bg-slate-100 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
              >
                {processing ? "Processing..." : "Confirm Purchase Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}