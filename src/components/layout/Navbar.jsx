import React, { useState } from "react";
import { Search, Bell, Menu, Globe, ChevronDown, X } from "lucide-react";

export default function Navbar({ onSearch, isVendor = false }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Theme configuration based on the role
  const theme = {
    accent: isVendor ? "text-emerald-600" : "text-blue-600",
    bgAccent: isVendor ? "bg-emerald-600" : "bg-blue-600",
    ring: isVendor ? "focus:ring-emerald-50" : "focus:ring-blue-50",
    border: isVendor ? "focus:border-emerald-500" : "focus:border-blue-500",
    hover: isVendor ? "hover:text-emerald-600" : "hover:text-blue-600",
    roleLabel: isVendor ? "Verified Vendor" : "Verified Buyer",
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (onSearch) onSearch("");
  };

  return (
    <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      
      {/* 1. Brand Logo - Logic to handle different accent colors */}
      <div className="flex items-center">
        <h1 className={`font-black text-2xl tracking-tighter cursor-pointer ${theme.accent}`}>
          Trade<span className="text-slate-900">Flow</span>
        </h1>
        {isVendor && (
          <span className="ml-3 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded border border-emerald-100">
            Vendor Portal
          </span>
        )}
      </div>

      {/* 2. Global Search with Dynamic Theme */}
      <div className="hidden md:flex flex-1 max-w-xl mx-12">
        <div className="relative w-full group">
          <Search 
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              searchTerm ? theme.accent : `text-slate-400 group-focus-within:${theme.accent}`
            }`} 
            size={18} 
          />
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={isVendor ? "Search inventory, orders, or RFQs..." : "Search products, vendors..."} 
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-10 text-sm focus:bg-white focus:ring-4 outline-none transition-all placeholder:text-slate-400 font-medium ${theme.ring} ${theme.border}`}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {searchTerm ? (
              <button onClick={clearSearch} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={14} />
              </button>
            ) : (
              <kbd className="hidden lg:block bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-sans font-bold">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* 3. Utility Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition text-xs font-bold uppercase tracking-tight">
          <Globe size={16} className="text-slate-400" />
          EN
          <ChevronDown size={12} className="text-slate-400" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        <button className={`relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group ${theme.hover}`}>
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform"></span>
        </button>

        {/* User Profile - Role specific labels and colors */}
        <div className="flex items-center gap-3 ml-2 pl-2 border-l border-slate-100 group cursor-pointer">
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-xs font-black text-slate-900 leading-tight tracking-tight uppercase">John Doe</span>
            <span className={`text-[10px] font-bold tracking-tighter uppercase ${theme.accent}`}>
              {theme.roleLabel}
            </span>
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200 transition-all transform group-active:scale-95 ${isVendor ? 'bg-slate-900 group-hover:bg-emerald-600' : 'bg-slate-900 group-hover:bg-blue-600'}`}>
            JD
          </div>
        </div>

        <button className="md:hidden p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}