import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { ShoppingBag, Truck, ArrowRight, Shield, Globe, Zap, CheckCircle, Loader2, Star, TrendingUp } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const scrollRef = useRef(null);

  // 1. Fetch real products
  useEffect(() => {
    const fetchTeaser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products/all`);
        // Take 8 products to fill the scroll area better
        setFeaturedProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch teaser products", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchTeaser();
  }, []);

  // 2. Auto-scroll logic for "Active Listings"
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }
      }, 4000); // Scrolls every 4 seconds
      return () => clearInterval(interval);
    }
  }, [featuredProducts]);

  const handleEntry = (role) => {
    navigate(`/${role}/login`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 relative overflow-hidden font-sans">
      
      {/* Global Progress Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600 z-50" />
      
      {/* Navigation Header */}
      <nav className="w-full max-w-7xl flex justify-between items-center py-6 z-20">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">T</div>
          <span className="text-xl font-black tracking-tighter text-slate-900">TradeFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <button onClick={() => handleEntry("buyer")} className="hover:text-blue-600 transition-colors">Marketplace</button>
          <button onClick={() => handleEntry("vendor")} className="hover:text-emerald-600 transition-colors">Become a Vendor</button>
          <button onClick={() => handleEntry("admin")} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-400 transition-all text-slate-700 shadow-sm">
            <Shield size={14} className="text-indigo-500" /> ADMIN
          </button>
        </div>
      </nav>

      {/* Ambient Background Blobs */}
      <div className="absolute top-20 -left-24 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
      <div className="absolute bottom-20 -right-24 w-[600px] h-[600px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center z-10 py-12 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Global Trade Network Live
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.85]">
          Wholesale <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
            Intelligence.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-16 leading-relaxed max-w-2xl mx-auto font-medium px-4">
          The unified ecosystem to <span className="text-slate-900 font-bold">Source</span>, 
          <span className="text-slate-900 font-bold"> Negotiate</span>, and <span className="text-slate-900 font-bold"> Ship</span> bulk goods with security.
        </p>

        {/* ACTIVE LISTINGS WITH SKELETONS & AUTO-SCROLL */}
        <div className="w-full max-w-7xl mx-auto mb-20">
          <div className="flex justify-between items-center mb-8 px-6">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-emerald-500" />
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">Live Supply</p>
              </div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">Active Bulk Listings</h4>
            </div>
            <button 
              onClick={() => handleEntry("buyer")}
              className="text-[10px] font-black text-blue-600 border-b-2 border-blue-600 pb-1 hover:text-blue-800 transition-all uppercase tracking-widest"
            >
              View Full Marketplace
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-10 px-6 no-scrollbar scroll-smooth"
          >
            {loadingProducts ? (
              // Skeleton Loader
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="min-w-[300px] h-[350px] bg-white rounded-[2.5rem] animate-pulse border border-slate-100 p-4">
                  <div className="w-full h-44 bg-slate-100 rounded-3xl mb-4" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded-full mb-3" />
                  <div className="h-6 w-3/4 bg-slate-100 rounded-full" />
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="min-w-[300px] bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-500 group relative"
                >
                  <div className="h-44 w-full rounded-3xl bg-slate-50 mb-4 overflow-hidden relative">
                    <img 
                      src={product.images?.[0] ? `${API_BASE_URL}${product.images[0]}` : "https://via.placeholder.com/400x300"} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-900 shadow-xl border border-white">
                      MOQ: {product.moq} {product.unit || 'PCS'}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{product.category}</p>
                    <h5 className="text-lg font-bold text-slate-900 mb-4 truncate group-hover:text-blue-600 transition-colors">{product.name}</h5>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Target Price</p>
                        <p className="text-2xl font-black text-slate-900">${product.price}</p>
                      </div>
                      <button 
                        onClick={() => handleEntry("buyer")}
                        className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Role Selection Section */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-20 px-6">
          <button
            onClick={() => handleEntry("buyer")}
            className="group p-10 bg-white border border-slate-200 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-blue-500 hover:-translate-y-2 transition-all duration-500 text-left relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-slate-900">
                <ShoppingBag size={240} />
            </div>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">I'm a Buyer</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
              Unlock factory-direct pricing and manage your global supply chain from one dashboard.
            </p>
            <span className="inline-flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest">
              Start Sourcing <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => handleEntry("vendor")}
            className="group p-10 bg-white border border-slate-200 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-emerald-500 hover:-translate-y-2 transition-all duration-500 text-left relative overflow-hidden"
          >
             <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-slate-900">
                <Truck size={240} />
            </div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <Truck size={32} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">I'm a Vendor</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
              Scale your distribution and connect with verified buyers looking for bulk fulfillment.
            </p>
            <span className="inline-flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest">
              Open Storefront <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
            </span>
          </button>
        </div>

        {/* Feature Icons Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-slate-200 w-full max-w-5xl">
            {[
              { icon: Globe, text: "Global Reach", sub: "140+ Countries" },
              { icon: Zap, text: "Instant RFQs", sub: "Fast Response" },
              { icon: Shield, text: "Escrow Hub", sub: "Secure Payments" },
              { icon: CheckCircle, text: "Verified", sub: "Factory Audits" }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                  <div className="p-3 bg-white rounded-2xl border border-slate-100 group-hover:border-blue-400 group-hover:shadow-lg transition-all">
                    <f.icon className="text-slate-400 group-hover:text-blue-600" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-900 mt-2">{f.text}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{f.sub}</span>
              </div>
            ))}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="w-full py-12 flex flex-col items-center gap-6 bg-white border-t border-slate-100">
        <div className="flex -space-x-4">
          {[21, 32, 43, 54, 65, 76].map((i) => (
            <img 
                key={i} 
                className="w-12 h-12 rounded-full border-[6px] border-white bg-slate-200 shadow-sm" 
                src={`https://i.pravatar.cc/100?img=${i}`} 
                alt="user" 
            />
          ))}
          <div className="w-12 h-12 rounded-full border-[6px] border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
            +10k
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] opacity-60">
          TradeFlow Secure Infrastructure &copy; 2026
        </p>
      </footer>
    </div>
  );
}