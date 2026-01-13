import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Store, 
  ShoppingBag, 
  Settings,
  Shield
} from "lucide-react";

export default function AdminSidebar({ isCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <BarChart3 size={20} />, path: "/admin/dashboard" },
    { name: "All Users", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Vendors", icon: <Store size={20} />, path: "/admin/vendors" },
    { name: "Buyers", icon: <ShoppingBag size={20} />, path: "/admin/buyers" },
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="p-4 flex-1 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Admin Portal
          </p>
        )}
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-slate-600 hover:bg-slate-50"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-bold text-sm whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="mt-8">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Settings
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => navigate("/admin/settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === "/admin/settings"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className={location.pathname === "/admin/settings" ? "text-indigo-600" : "text-slate-400"}>
                <Settings size={20} />
              </span>
              {!isCollapsed && (
                <span className="font-bold text-sm whitespace-nowrap">Settings</span>
              )}
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className={`bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-3 text-white shadow-lg shadow-indigo-100 ${isCollapsed ? "flex justify-center" : ""}`}>
           {isCollapsed ? <Shield size={20}/> : <p className="text-xs font-bold text-center uppercase">Admin Panel</p>}
        </div>
      </div>
    </div>
  );
}
