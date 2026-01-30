import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Shield, Mail, User, Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

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

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (passwordData.currentPassword && passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = "New password must be different";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const token = localStorage.getItem("token");
    setPasswordLoading(true);
    setPasswordSuccess(false);
    setPasswordErrors({});

    try {
      await axios.patch(
        "http://localhost:5000/api/auth/password", 
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 3000);
    } catch (err) {
      // Logic to catch the "400 Bad Request" message from your backend
      const errorMessage = err.response?.data?.message || "Failed to update password";
      setPasswordErrors({ submit: errorMessage });
    } finally {
      setPasswordLoading(false);
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
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {userData.name ? userData.name.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{userData.name || "Admin"}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase">
                {userData.role || "Admin"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <User size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-black text-slate-900">{userData.name || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Mail size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-sm font-black text-slate-900">{userData.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Shield size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                <p className="text-sm font-black text-slate-900 capitalize">{userData.role || "Admin"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Change Password</h4>
                <p className="text-xs text-slate-500 font-medium">Update your account password for security</p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setPasswordErrors({});
                  setPasswordSuccess(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  showPasswordForm ? "bg-slate-100 text-slate-600" : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {showPasswordForm ? "Cancel" : "Update Password"}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {passwordSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <CheckCircle className="text-emerald-600" size={20} />
                    <p className="text-sm font-bold text-emerald-900">Password updated successfully!</p>
                  </div>
                )}

                {passwordErrors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                    <XCircle className="text-red-600" size={20} />
                    <p className="text-sm font-bold text-red-900">{passwordErrors.submit}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className={`w-full p-4 pr-12 bg-slate-50 border rounded-2xl outline-none transition-all ${passwordErrors.currentPassword ? "border-red-300" : "border-slate-200 focus:border-indigo-500"}`}
                      placeholder="Enter current password"
                    />
                    <button type="button" onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && <p className="mt-1 text-xs text-red-600 font-bold">{passwordErrors.currentPassword}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className={`w-full p-4 pr-12 bg-slate-50 border rounded-2xl outline-none transition-all ${passwordErrors.newPassword ? "border-red-300" : "border-slate-200 focus:border-indigo-500"}`}
                      placeholder="Min. 6 characters"
                    />
                    <button type="button" onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && <p className="mt-1 text-xs text-red-600 font-bold">{passwordErrors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className={`w-full p-4 pr-12 bg-slate-50 border rounded-2xl outline-none transition-all ${passwordErrors.confirmPassword ? "border-red-300" : "border-slate-200 focus:border-indigo-500"}`}
                      placeholder="Repeat new password"
                    />
                    <button type="button" onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && <p className="mt-1 text-xs text-red-600 font-bold">{passwordErrors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="font-black text-slate-900 mb-4 uppercase text-sm">Quick Actions</h4>
            <div className="space-y-3">
              <button onClick={() => navigate("/admin/dashboard")} className="w-full py-3 px-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all">
                View Dashboard
              </button>
              <button onClick={() => navigate("/admin/users")} className="w-full py-3 px-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
                Manage Users
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
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