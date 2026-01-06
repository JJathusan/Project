import React from "react";
import { 
  TrendingUp, 
  Package, 
  MessageSquareQuote, 
  Users, 
  AlertCircle, 
  ArrowUpRight 
} from "lucide-react";

export default function VendorDashboard() {
  const stats = [
    { 
        label: "Revenue (MTD)", 
        value: "$42,850", 
        grow: "+12%", 
        color: "text-emerald-600", 
        bg: "bg-emerald-50",
        icon: <TrendingUp size={20} />
    },
    { 
        label: "Active Quotes", 
        value: "18", 
        grow: "+2", 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        icon: <MessageSquareQuote size={20} />
    },
    { 
        label: "Pending Shipments", 
        value: "7", 
        grow: "Critical", 
        color: "text-orange-600", 
        bg: "bg-orange-50",
        icon: <Package size={20} />
    },
    { 
        label: "New RFQs", 
        value: "24", 
        grow: "+5", 
        color: "text-purple-600", 
        bg: "bg-purple-50",
        icon: <Users size={20} />
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vendor Console</h2>
        <p className="text-slate-500 font-medium">Manage your bulk inventory and global trade requests.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                 {stat.icon}
               </div>
               <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.grow}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RFQ Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900">High Priority RFQs</h3>
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View All Inquiries</button>
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs">#0{item}</div>
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-none mb-1">Raw Cotton Bulk (500 Tons)</p>
                    <p className="text-xs text-slate-500 font-medium">From: Global Fabrics Ltd • Deadline: 48h</p>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95">
                  Send Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
           <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><AlertCircle size={20}/></div>
            <h3 className="font-bold text-slate-900">Inventory Health</h3>
          </div>
          <div className="space-y-6 flex-1">
             <div>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                   <span className="text-slate-500">Solar Panels X1</span>
                   <span className="text-red-600 font-black">Low (12%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 w-[12%] rounded-full"></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                   <span className="text-slate-500">Polyester Yarn</span>
                   <span className="text-emerald-600 font-black">Healthy (84%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[84%] rounded-full"></div>
                </div>
             </div>
          </div>
          <button className="w-full py-3 mt-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all uppercase tracking-widest">
            + Restock Inventory
          </button>
        </div>
      </div>
    </div>
  );
}