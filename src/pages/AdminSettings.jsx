import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Shield, Mail, User, Loader2 } from "lucide-react";

export default function AdminSettings() {
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
      navigate("/admin/login");
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
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase text-xs tracking-widest">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Settings</h2>
        <p className="text-slate-500 font-medium">Manage your admin account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {userData.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{userData.name}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase">
                {userData.role || "Admin"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <User size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-black text-slate-900">{userData.name || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <Mail size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-sm font-black text-slate-900">{userData.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl">
                <Shield size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                <p className="text-sm font-black text-slate-900 capitalize">{userData.role || "Admin"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="font-black text-slate-900 mb-4 uppercase text-sm">Quick Actions</h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all"
              >
                View Dashboard
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full py-3 px-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
              >
                Manage Users
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white">
            <h4 className="font-black mb-2 uppercase text-sm">Admin Status</h4>
            <p className="text-xs opacity-90 mb-4">You have full system access</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
