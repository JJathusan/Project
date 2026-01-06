import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Box, 
  MessageSquareQuote, 
  ClipboardList, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Store
} from "lucide-react";

export default function VendorSidebar({ isCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Overview", icon: <BarChart3 size={20} />, path: "/vendor/dashboard" },
    { name: "Inventory", icon: <Box size={20} />, path: "/vendor/inventory" },
    { name: "Quotes & RFQs", icon: <MessageSquareQuote size={20} />, path: "/vendor/quotes" },
    { name: "Sales Orders", icon: <ClipboardList size={20} />, path: "/vendor/orders" },
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="p-4 flex-1 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Vendor Portal
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
                    ? "bg-emerald-50 text-emerald-600" 
                    : "text-slate-600 hover:bg-slate-50"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-emerald-600" : "text-slate-400"}>
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
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className={`bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-3 text-white shadow-lg shadow-emerald-100 ${isCollapsed ? "flex justify-center" : ""}`}>
           {isCollapsed ? <Store size={20}/> : <p className="text-xs font-bold text-center uppercase">Store Live</p>}
        </div>
      </div>
    </div>
  );
}