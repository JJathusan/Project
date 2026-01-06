import React from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Plus, 
  MoreVertical, 
  Filter, 
  ArrowUpDown, 
  Package, 
  AlertTriangle 
} from "lucide-react";

export default function VendorInventory() {
  // SAFETY FIX: Added default empty object to prevent "is null" error
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || ""; 

  const inventory = [
    { id: "SKU-001", name: "Premium Raw Cotton", category: "Textiles", stock: "500 Tons", price: "$1,200/Ton", status: "In Stock" },
    { id: "SKU-002", name: "Solar Panel X1 - 400W", category: "Energy", stock: "45 Units", price: "$150/Unit", status: "Low Stock" },
    { id: "SKU-003", name: "Industrial Grade Steel", category: "Construction", stock: "0 Tons", price: "$850/Ton", status: "Out of Stock" },
    { id: "SKU-004", name: "Polyester Yarn - Grade A", category: "Textiles", stock: "1,200 Rolls", price: "$45/Roll", status: "In Stock" },
  ];

  // Filter logic based on the Navbar search bar
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inventory</h2>
          <p className="text-slate-500 font-medium text-sm">Manage your bulk products and wholesale pricing.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-emerald-100 active:scale-95 uppercase tracking-widest">
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all tracking-widest">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all tracking-widest">
              <ArrowUpDown size={14} /> Sort
            </button>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing {filteredInventory.length} Items
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulk Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-slate-700">{item.stock}</td>
                  <td className="px-6 py-4 font-black text-sm text-emerald-600">{item.price}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "In Stock": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Low Stock": "bg-orange-50 text-orange-600 border-orange-100",
    "Out of Stock": "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border flex items-center gap-1.5 w-fit ${styles[status]}`}>
      {status === "Low Stock" && <AlertTriangle size={10} />}
      {status}
    </span>
  );
}