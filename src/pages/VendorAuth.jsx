import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ArrowRight, User, Mail, Lock, Building2 } from "lucide-react";
import axios from "axios";

export default function VendorAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    companyName: "" 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, { 
        ...formData, 
        role: "vendor" 
      });

      if (res.data.token) {
        localStorage.clear(); // Important to clear previous user data
        
        // Save using the nested user object from your new backend fix
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", res.data.user.role);
        localStorage.setItem("userName", res.data.user.name);

        navigate("/vendor/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Authentication failed";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {/* Visual Sidebar */}
        <div className="bg-emerald-600 p-12 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <Truck size={24} />
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tighter uppercase">Vendor <br/> Console</h2>
          </div>
          <p className="font-bold text-emerald-100">Manage your global inventory and respond to RFQs in real-time.</p>
        </div>

        {/* Form Area */}
        <div className="p-12">
          <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">
            {isLogin ? "Sign In to Dashboard" : "Register Company"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Name Input (Added this - required by your Model) */}
            {!isLogin && (
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Your Full Name" 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            {/* 2. Company Name Input */}
            {!isLogin && (
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Company Name" 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
            )}

            {/* 3. Email Input */}
            <div className="relative">
              <input 
                type="email" 
                placeholder="Business Email" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* 4. Password Input */}
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-95">
              {isLogin ? "Access Dashboard" : "Start Selling"} <ArrowRight size={18} />
            </button>
          </form>

          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="mt-8 text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline block w-full text-center"
          >
             {isLogin ? "Join as a new vendor" : "Back to login"}
          </button>
        </div>
      </div>
    </div>
  );
}