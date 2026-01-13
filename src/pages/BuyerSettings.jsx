import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Save, User, Mail, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function BuyerSettings() {
  const context = useOutletContext() || {};
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserData({
        name: res.data.name || "",
        email: res.data.email || ""
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // Fallback to localStorage
      const name = localStorage.getItem("userName") || "";
      const email = localStorage.getItem("userEmail") || "";
      setUserData({ name, email });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "http://localhost:5000/api/auth/profile",
        {
          name: userData.name,
          email: userData.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update localStorage
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userEmail", res.data.user.email);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/api/auth/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPasswordSaved(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setPasswordSaved(false);
      }, 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Settings</h2>
        <p className="text-slate-500 font-medium">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <User size={20} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Profile Information</h3>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 disabled:bg-slate-100 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
                <CheckCircle size={16} />
                Profile updated successfully
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-bold">
                <XCircle size={16} />
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Lock size={20} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Current Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Confirm New Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-4 bg-slate-900 disabled:bg-slate-100 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              Update Password
            </button>
            {passwordSaved && (
              <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
                <CheckCircle size={16} />
                Password updated successfully
              </div>
            )}
            {passwordError && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-bold">
                <XCircle size={16} />
                {passwordError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
