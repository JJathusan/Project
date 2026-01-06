import React from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Truck, 
  PackageCheck, 
  MapPin, 
  Calendar, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function VendorOrders() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";

  const orders = [
    { 
      id: "ORD-9901", 
      buyer: "Global Fabrics Ltd", 
      product: "Premium Raw Cotton", 
      amount: "$600,000", 
      date: "Jan 12, 2026",
      destination: "Port of Rotterdam, NL",
      status: "Processing" 
    },
    { 
      id: "ORD-8852", 
      buyer: "TechPower Solutions", 
      product: "Solar Panels X1", 
      amount: "$45,000", 
      date: "Jan 10, 2026",
      destination: "Dubai Logistics City, UAE",
      status: "Shipped" 
    }
  ];

  const filteredOrders = orders.filter(o => 
    o.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sales Orders</h2>
        <p className="text-slate-500 font-medium">Track fulfillment, shipping status, and payments.</p>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Top Bar */}
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-900">{order.id}</span>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <Calendar size={14} /> {order.date}
                </div>
              </div>
              <button className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                Download Invoice <ExternalLink size={14} />
              </button>
            </div>

            {/* Order Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product & Buyer */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <PackageCheck size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-tight">{order.product}</h3>
                  <p className="text-sm text-slate-500 font-medium">Buyer: {order.buyer}</p>
                  <p className="text-lg font-black text-emerald-600 mt-1">{order.amount}</p>
                </div>
              </div>

              {/* Logistics */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                    <p className="text-xs font-bold text-slate-700">{order.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</p>
                    <p className="text-xs font-bold text-slate-700">Maersk Logistics (TBD)</p>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-col justify-center items-end gap-4">
                <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-[0.15em] ${
                  order.status === "Shipped" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {order.status}
                </div>
                <button className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                  Update Tracking <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}