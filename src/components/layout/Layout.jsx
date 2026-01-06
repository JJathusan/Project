import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Layout() {
  // State for collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State for global search query
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col w-full h-screen bg-slate-50 overflow-hidden">
      {/* Navbar with Search Logic */}
      <nav className="flex-none z-20">
        <Navbar onSearch={(val) => setSearchQuery(val)} isVendor={false} />
      </nav>

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* SIDEBAR: Width transitions based on isCollapsed */}
        <aside 
          className={`${
            isCollapsed ? "w-20" : "w-64"
          } flex-none h-full border-r border-slate-200 bg-white transition-all duration-300 ease-in-out relative z-10`}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-blue-600 shadow-sm z-30 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Sidebar content reacts to collapse state */}
          <Sidebar isCollapsed={isCollapsed} />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          <div className="p-8 max-w-[1600px] mx-auto">
            {/* Pass searchQuery to children (Marketplace, Orders, etc.) 
               so they can filter their lists automatically.
            */}
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
}