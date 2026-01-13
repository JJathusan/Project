import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AdminSidebar from "./AdminSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col w-full h-screen bg-slate-50 overflow-hidden">
      <nav className="flex-none z-20">
        <Navbar onSearch={(val) => setSearchQuery(val)} isVendor={false} />
      </nav>

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <aside 
          className={`${isCollapsed ? "w-20" : "w-64"} flex-none h-full border-r border-slate-200 bg-white transition-all duration-300 ease-in-out relative z-10`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-indigo-600 shadow-sm z-30"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <AdminSidebar isCollapsed={isCollapsed} />
        </aside>

        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          <div className="p-8 max-w-[1600px] mx-auto">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
}
