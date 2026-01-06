import React from "react";
import Card from "../components/ui/Card";
import { Filter, SlidersHorizontal } from "lucide-react";

const products = [
  { name: "Cotton Fabric", moq: "500 m", price: "$8.00", unit: "meter", category: "Textiles", stock: "In Stock" },
  { name: "Steel Pipes", moq: "1000 pcs", price: "$20.50", unit: "unit", category: "Construction", stock: "Low Stock" },
  { name: "Plastic Bottles", moq: "2000 units", price: "$1.50", unit: "unit", category: "Packaging", stock: "In Stock" },
  { name: "Industrial Gears", moq: "50 pcs", price: "$120.00", unit: "unit", category: "Machinery", stock: "In Stock" },
];

export default function Marketplace() {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bulk Marketplace</h2>
          <p className="text-slate-500 text-sm">Find the best wholesale prices from verified SMEs.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            <SlidersHorizontal size={16} /> Sort By
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <Card key={i} product={p} />
        ))}
      </div>
    </div>
  );
}