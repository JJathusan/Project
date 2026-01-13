import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ShoppingBag, ArrowRight } from "lucide-react";
import axios from "axios";

export default function BuyerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, { ...formData, role: "buyer" });
      
      if (res.data.token) {
        localStorage.clear(); // Clear any old sessions
        localStorage.setItem("token", res.data.token);
        
        // Use the new path: res.data.user
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userRole", res.data.user.role);
        
        navigate("/market");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Side: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 flex-col justify-between text-white">
        <h1 className="text-3xl font-black italic tracking-tighter">TradeFlow <span className="text-blue-200">Buyer</span></h1>
        <div>
          <h2 className="text-5xl font-black leading-tight mb-6">Source from verified global vendors.</h2>
          <p className="text-blue-100 text-lg">Access wholesale pricing and secure trade finance.</p>
        </div>
        <p className="text-sm opacity-60">© 2026 TradeFlow Global Sourcing</p>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">{isLogin ? "Buyer Sign In" : "Join as a Buyer"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
            <input 
              type="text" placeholder="Full Name" 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-slate-900 placeholder:text-slate-400"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            )}
            <input 
              type="email" placeholder="Email Address" 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-slate-900 placeholder:text-slate-400"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="password" placeholder="Password" 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-slate-900 placeholder:text-slate-400"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              {isLogin ? "Enter Marketplace" : "Create Buyer Account"} <ArrowRight size={18} />
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-sm font-bold text-slate-400 hover:text-blue-600 uppercase">
            {isLogin ? "Need a buyer account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}