import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";

export default function AdminAuth() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/login`, { 
        ...formData, 
        role: "admin" 
      });

      if (res.data.token) {
        localStorage.clear();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", res.data.user.role);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userEmail", res.data.user.email);

        navigate("/admin/dashboard");
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
        <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tighter uppercase">Admin <br/> Console</h2>
          </div>
          <p className="font-bold text-indigo-100">Manage all vendors and buyers from a centralized dashboard.</p>
        </div>

        {/* Form Area */}
        <div className="p-12">
          <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">
            Admin Sign In
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input 
                type="email" 
                placeholder="Admin Email" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-95">
              Access Admin Panel <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
