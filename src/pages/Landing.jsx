import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  // Function updated to navigate to the specific role-based login pages
  const handleEntry = (role) => {
    if (role === "vendor") {
      navigate("/vendor/login");
    } else {
      navigate("/buyer/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
      
      {/* 1. Global Progress Border */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-green-500 to-emerald-400 z-50" />
      
      {/* 2. Modern Ambient Background Blobs */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse" />

      {/* 3. Hero Content */}
      <div className="text-center max-w-4xl z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Now Open for Global SME Trade
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]">
          Digital Bulk Trade for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
            Smart SMEs
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
          The unified ecosystem to <span className="text-slate-900">Source</span>, 
          <span className="text-slate-900"> Negotiate</span>, and 
          <span className="text-slate-900"> Ship</span> bulk goods with enterprise-grade security.
        </p>

        {/* 4. Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          
          {/* Buyer Entry */}
          <button
            onClick={() => handleEntry("buyer")}
            className="group relative p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 rotate-3 group-hover:rotate-0">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">I'm a Buyer</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Access wholesale prices, request quotes, and manage your supply chain.
            </p>
            <div className="flex items-center text-blue-600 font-bold text-sm">
              Enter Marketplace <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Vendor Entry */}
          <button
            onClick={() => handleEntry("vendor")}
            className="group relative p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 -rotate-3 group-hover:rotate-0">
              <Truck size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">I'm a Vendor</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Scale your exports, manage inventory, and respond to global RFQs.
            </p>
            <div className="flex items-center text-emerald-600 font-bold text-sm">
              Vendor Dashboard <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* 5. Trust Footer */}
      <footer className="absolute bottom-10 flex flex-col items-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            +5k
          </div>
        </div>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
          Verified Trade Network
        </p>
      </footer>
    </div>
  );
}