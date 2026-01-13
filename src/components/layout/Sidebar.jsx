import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutGrid, 
  FileText, 
  Package, 
  Truck, 
  Settings, 
  HelpCircle,
  Bell,
  ChevronRight
} from "lucide-react";

export default function Sidebar({ isCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Marketplace", icon: <LayoutGrid size={20} />, path: "/market" },
    { name: "RFQs", icon: <FileText size={20} />, path: "/buyer/rfqs" },
    { name: "Orders & Shipments", icon: <Package size={20} />, path: "/buyer/orders" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/buyer/notifications" },
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
        {/* Main Menu Label */}
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 whitespace-nowrap">
            Main Menu
          </p>
        )}
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${isCollapsed ? "justify-center" : "justify-between"}`}
                title={isCollapsed ? item.name : ""}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 whitespace-nowrap">
              Support
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => navigate("/buyer/settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${
                location.pathname === "/buyer/settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              } ${isCollapsed ? "justify-center" : ""}`}
              title="Settings"
            >
              <Settings size={20} className={location.pathname === "/buyer/settings" ? "text-blue-600" : "text-slate-400"} />
              {!isCollapsed && "Settings"}
            </button>
            <button
              onClick={() => navigate("/buyer/help")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${
                location.pathname === "/buyer/help"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              } ${isCollapsed ? "justify-center" : ""}`}
              title="Help Center"
            >
              <HelpCircle size={20} className={location.pathname === "/buyer/help" ? "text-blue-600" : "text-slate-400"} />
              {!isCollapsed && "Help Center"}
            </button>
          </nav>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-3 text-white shadow-lg shadow-blue-100 transition-all ${isCollapsed ? "aspect-square flex items-center justify-center p-0" : ""}`}>
          {isCollapsed ? (
            <div className="text-[10px] font-black uppercase">Pro</div>
          ) : (
            <>
              <p className="text-[10px] opacity-80 mb-0.5">Current Plan</p>
              <p className="text-xs font-black mb-3 uppercase tracking-tight">SME Pro</p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold transition uppercase">
                Upgrade
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}