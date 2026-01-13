import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, Globe, ChevronDown, X, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onSearch, isVendor = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "User", role: "Member" });
  const navigate = useNavigate();

  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "admin";

  // Theme configuration
  const theme = {
    accent: isAdmin ? "text-indigo-600" : isVendor ? "text-emerald-600" : "text-blue-600",
    bgAccent: isAdmin ? "bg-indigo-600" : isVendor ? "bg-emerald-600" : "bg-blue-600",
    hover: isAdmin ? "hover:bg-indigo-50" : isVendor ? "hover:bg-emerald-50" : "hover:bg-blue-50",
    roleLabel: isAdmin ? "Admin" : isVendor ? "Verified Vendor" : "Verified Buyer",
  };

  // Fetch User Data from localStorage/Token on mount
  useEffect(() => {
    const name = localStorage.getItem("userName"); // Assuming you save this during login
    const role = localStorage.getItem("userRole"); 
    if (name) {
      setUserData({ name, role: role || (isVendor ? "Vendor" : "Buyer") });
    }
  }, [isVendor]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("companyName");
    if (isAdmin) {
      navigate("/admin/login");
    } else if (isVendor) {
      navigate("/vendor/login");
    } else {
      navigate("/buyer/login");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* 1. Brand Logo */}
      <div className="flex items-center">
        <h1 className={`font-black text-2xl tracking-tighter cursor-pointer ${theme.accent}`} onClick={() => navigate('/')}>
          Trade<span className="text-slate-900">Flow</span>
        </h1>
        {isAdmin && (
          <span className="ml-3 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded border border-indigo-100">
            Admin Portal
          </span>
        )}
        {isVendor && !isAdmin && (
          <span className="ml-3 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded border border-emerald-100">
            Vendor Portal
          </span>
        )}
      </div>

      {/* 2. Global Search */}
      <div className="hidden md:flex flex-1 max-w-xl mx-12">
        <div className="relative w-full group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? theme.accent : 'text-slate-400'}`} size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={isVendor ? "Search inventory..." : "Search products..."} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-10 text-sm focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
          />
        </div>
      </div>

      {/* 3. Utility Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {isVendor && (
          <button 
            onClick={() => navigate("/vendor/notifications")}
            className={`relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all`}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        )}

        {/* User Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 ml-2 pl-2 border-l border-slate-100 group cursor-pointer"
          >
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{userData.name}</span>
              <span className={`text-[10px] font-bold uppercase ${theme.accent}`}>
                {theme.roleLabel}
              </span>
            </div>
            
            {/* Dynamic Avatar Initials */}
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200 transition-all ${isAdmin ? 'bg-indigo-600' : isVendor ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {userData.name.substring(0, 2).toUpperCase()}
            </div>
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden py-2 animate-in fade-in zoom-in duration-150">
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{userData.name}</p>
                </div>
                
                {!isAdmin && (
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(isVendor ? "/vendor/profile" : "/buyer/profile");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 ${theme.hover} transition-colors`}
                  >
                    <User size={16} /> My Profile
                  </button>
                )}
                {!isAdmin && (
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate(isVendor ? "/vendor/settings" : "/buyer/settings");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 ${theme.hover} transition-colors`}
                  >
                    <Settings size={16} /> Account Settings
                  </button>
                )}
                
                <div className="h-px bg-slate-100 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}