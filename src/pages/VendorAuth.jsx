import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

export default function VendorAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    companyName: "" 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, { 
        ...formData, 
        role: "vendor" 
      });

      // If Signup was successful but not a login
      if (!isLogin) {
        alert("Registration successful! Please login.");
        setIsLogin(true);
        setLoading(false);
        return;
      }

      // LOGIN LOGIC
      if (res.data.token) {
        localStorage.clear(); 

        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("tempCompanyName", formData.companyName || user.companyName || "");
        
        // Store the status from backend
        const isSetupDone = user.isProfileSetup === true;
        localStorage.setItem("isProfileSetup", isSetupDone ? "true" : "false");

        if (isSetupDone) {
          navigate("/vendor/dashboard");
        } else {
          // Verify this matches your App.js route path!
          navigate("/vendor-setup"); 
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Authentication failed";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Left Side: Brand */}
        <div className="bg-emerald-600 p-12 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <Truck size={24} />
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tighter uppercase">Vendor <br/> Console</h2>
          </div>
          <div>
            <p className="font-bold text-emerald-100 mb-2 italic">"Powering Global Supply Chains"</p>
            <p className="text-sm font-medium text-emerald-100/80">Manage inventory and respond to RFQs in real-time.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12">
          <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">
            {isLogin ? "Sign In" : "Register Company"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Your Full Name" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            )}

            {!isLogin && (
              <input 
                type="text" 
                placeholder="Legal Company Name" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
            )}

            <input 
              type="email" 
              placeholder="Business Email" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />

            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Access Dashboard" : "Start Selling")}
            </button>
          </form>

          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="mt-8 text-xs font-black text-emerald-600 uppercase tracking-widest block w-full text-center"
          >
             {isLogin ? "Join as a new vendor" : "Back to login"}
          </button>
        </div>
      </div>
    </div>
  );
}