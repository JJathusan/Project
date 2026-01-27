import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft, ShieldCheck, Globe, Clock, FileText,
  MessageSquare, Truck, CheckCircle, Package, Loader2, X, Star,
  ChevronRight, ChevronLeft, Settings
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // IMPORTANT: Ensure this matches your backend server URL
  const API_BASE = "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentUnitPrice, setCurrentUnitPrice] = useState(0);
  
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");
  const [orderAddress, setOrderAddress] = useState({
    street: "", city: "", state: "", country: "", zipCode: ""
  });
  const [processing, setProcessing] = useState(false);

  // 1. Fetch Dynamic Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/products/${id}`);
        setProduct(res.data);
        
        // Setup initial values
        setQuantity(res.data.moq || 1);
        setCurrentUnitPrice(res.data.price || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // 2. Dynamic Price Calculation (Flat Price or Tiered)
  useEffect(() => {
    if (product) {
      let unitPrice = product.price || 0;

      if (product.tiers && product.tiers.length > 0) {
        const applicableTier = [...product.tiers]
          .reverse()
          .find(tier => quantity >= tier.minQty) || product.tiers[0];
        unitPrice = applicableTier.price;
      }

      setCurrentUnitPrice(unitPrice);
      setTotalPrice(quantity * unitPrice);
    }
  }, [quantity, product]);

  const handleQuoteRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/buyer/login"); return; }
    setProcessing(true);
    try {
      await axios.post(`${API_BASE}/api/quotes/request`, 
        { productId: product._id, quantity, message: quoteMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quote request submitted!");
      setShowQuoteModal(false);
    } catch (err) { alert("Submission failed"); } finally { setProcessing(false); }
  };

  const handlePurchaseOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/buyer/login"); return; }
    if (!orderAddress.street || !orderAddress.city || !orderAddress.country) {
        alert("Please fill shipping details");
        return;
    }
    setProcessing(true);
    try {
      await axios.post(`${API_BASE}/api/orders/create`,
        { productId: product._id, quantity, unitPrice: currentUnitPrice, shippingAddress: orderAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Purchase order created!");
      setShowOrderModal(false);
    } catch (err) { alert("Order failed"); } finally { setProcessing(false); }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Secure TradeFlow Database...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="p-20 text-center font-bold">
      <h2 className="text-2xl text-slate-800 uppercase">Product Offline or Removed</h2>
      <button onClick={() => navigate("/market")} className="mt-4 text-blue-600 underline">Return to Market</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Navigation */}
      <button onClick={() => navigate("/market")} className="flex items-center text-slate-400 hover:text-blue-600 transition text-[10px] font-black uppercase tracking-widest group">
        <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Global Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Specs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Image Gallery */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm p-4">
            <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-slate-100 group">
              <img 
                src={product.images && product.images.length > 0 
                    ? `${API_BASE}${product.images[activeImage]}` 
                    : "https://via.placeholder.com/800x450?text=No+Image+Available"} 
                className="w-full h-full object-cover" 
                alt={product.name} 
              />
              {product.images?.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)} className="p-2 bg-white/90 rounded-full shadow-lg text-slate-900 hover:bg-white"><ChevronLeft size={20}/></button>
                   <button onClick={() => setActiveImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)} className="p-2 bg-white/90 rounded-full shadow-lg text-slate-900 hover:bg-white"><ChevronRight size={20}/></button>
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-60'}`}
                  >
                    <img src={`${API_BASE}${img}`} className="w-full h-full object-cover" alt="thumb" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Globe size={14} className="mr-1 text-blue-600" /> Origin: {product.location || "Global"}
              </div>
              <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Package size={14} className="mr-1 text-emerald-600" /> Stock: {product.stock} {product.unit}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h3 className="font-black text-slate-900 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-blue-600"/> Description
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8 font-medium">{product.description}</p>
              
              {/* Dynamic Technical Specifications from VendorInventory */}
              {product.specifications?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-black text-slate-900 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                    <Settings size={16} className="text-blue-600"/> Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{spec.key}</span>
                        <span className="text-xs font-bold text-slate-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600"><Clock size={20} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lead Time</p>
                    <p className="text-sm font-black text-slate-700">{product.leadTime || "15-20 days"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quality Control</p>
                    <p className="text-sm font-black text-slate-700">ISO Verified Standard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Procurement Tools */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl sticky top-24">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Order Calculator</h3>

            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Order Quantity ({product.unit})</label>
              <div className="relative">
                <input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xl font-black focus:border-blue-600 outline-none transition-all text-slate-900"
                />
                <Package className="absolute right-5 top-4 text-slate-300" size={24} />
              </div>
              {quantity < product.moq && (
                <p className="text-red-500 text-[10px] mt-2 font-black uppercase italic">MOQ Requirement: {product.moq} {product.unit}</p>
              )}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 mb-8 text-white shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Current Price</span>
                <span className="text-lg font-black text-white">${currentUnitPrice.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10 mb-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Estimate</span>
                <span className="text-3xl font-black text-blue-400 tracking-tighter">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Price Tiers Display */}
            {product.tiers?.length > 0 && (
               <div className="space-y-2 mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Volume Discounts</p>
                {product.tiers.map((tier, idx) => {
                  const isActive = quantity >= tier.minQty;
                  return (
                    <div key={idx} className={`flex justify-between text-[10px] font-black uppercase p-3 rounded-xl border transition-all ${isActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                      <span>{tier.minQty}+ {product.unit}</span>
                      <span>${tier.price.toFixed(2)}</span>
                    </div>
                  );
                })}
               </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowOrderModal(true)} 
                disabled={quantity < product.moq} 
                className="w-full bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg"
              >
                Proceed to Order <CheckCircle size={18} />
              </button>
              <button 
                onClick={() => setShowQuoteModal(true)} 
                className="w-full bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                Custom Quotation <FileText size={18} />
              </button>
            </div>

            {/* Vendor Details */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                   {product.vendor?.logo 
                    ? <img src={`${API_BASE}${product.vendor.logo}`} className="w-full h-full object-cover" alt="Vendor Logo" /> 
                    : <Package className="text-slate-300" />
                   }
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Verified Supplier</p>
                  <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">{product.vendor?.companyName || "Authorized Vendor"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowQuoteModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X/></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Request Quotation</h3>
            <textarea 
                value={quoteMessage} 
                onChange={(e) => setQuoteMessage(e.target.value)} 
                placeholder="Include custom requirements, shipping preferences, or packaging needs..." 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl h-32 mb-4 outline-none focus:border-blue-600 transition-all font-medium" 
            />
            <button onClick={handleQuoteRequest} disabled={processing} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">
              {processing ? "Sending Request..." : "Submit Inquiry"}
            </button>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowOrderModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X/></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Confirm Purchase</h3>
            
            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                    <span>Order Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="text-xs font-bold text-slate-600">Quantity: {quantity} {product.unit}</div>
            </div>

            <div className="space-y-4">
              <input 
                type="text" placeholder="Street Address" 
                value={orderAddress.street} 
                onChange={(e) => setOrderAddress({...orderAddress, street: e.target.value})} 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" placeholder="City" 
                    value={orderAddress.city} 
                    onChange={(e) => setOrderAddress({...orderAddress, city: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" 
                />
                <input 
                    type="text" placeholder="Country" 
                    value={orderAddress.country} 
                    onChange={(e) => setOrderAddress({...orderAddress, country: e.target.value})} 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" 
                />
              </div>
              <button 
                onClick={handlePurchaseOrder} 
                disabled={processing} 
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all"
              >
                {processing ? "Processing..." : "Confirm & Send Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}