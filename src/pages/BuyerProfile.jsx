import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, ShoppingBag, Loader2 } from "lucide-react";

export default function BuyerProfile() {
  const context = useOutletContext() || {};
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserData({
        name: res.data.name || "",
        email: res.data.email || "",
        role: res.data.role || ""
      });

      // Update localStorage to keep it in sync
      localStorage.setItem("userName", res.data.name || "");
      localStorage.setItem("userEmail", res.data.email || "");
      localStorage.setItem("userRole", res.data.role || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // Fallback to localStorage if API fails
      const name = localStorage.getItem("userName") || "";
      const email = localStorage.getItem("userEmail") || "";
      const role = localStorage.getItem("userRole") || "";
      setUserData({ name, email, role });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase text-xs tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Profile</h2>
        <p className="text-slate-500 font-medium">View your account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {userData.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{userData.name}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase">
                {userData.role || "Buyer"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <User size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-black text-slate-900">{userData.name || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-sm font-black text-slate-900">{userData.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <ShoppingBag size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                <p className="text-sm font-black text-slate-900 capitalize">{userData.role || "Buyer"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="font-black text-slate-900 mb-4 uppercase text-sm">Quick Actions</h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/buyer/settings")}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/market")}
                className="w-full py-3 px-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
              >
                Browse Marketplace
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
            <h4 className="font-black mb-2 uppercase text-sm">Account Status</h4>
            <p className="text-xs opacity-90 mb-4">Your account is active and verified</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-bold">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
