import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Card({ product }) {
  // Ensure we have a fallback ID to prevent broken links
  const productId = product.id || '1';

  return (
    <Link to={`/market/${productId}`} className="block group">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        
        {/* Product Image Placeholder */}
        <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-100 overflow-hidden">
          <div className="text-slate-300 font-bold text-lg group-hover:scale-110 transition-transform duration-300">
            {product.name ? product.name.substring(0, 2).toUpperCase() : "PR"}
          </div>
        </div>

        <div className="p-5">
          {/* Category and Stock Badges */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              product.stock === "Low Stock" ? "text-orange-600 bg-orange-50" : "text-emerald-600 bg-emerald-50"
            }`}>
              {product.stock}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-xl font-bold text-slate-900">{product.price}</span>
            <span className="text-slate-500 text-xs">/ {product.unit}</span>
          </div>

          {/* Progress Bar / MOQ Section */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Min Order (MOQ)</span>
              <span className="font-semibold text-slate-700">{product.moq}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-2/3"></div>
            </div>
          </div>

          {/* Action Button (Now purely visual since Link wraps the card) */}
          <div className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-sm group-hover:bg-blue-600 transition-colors">
            View Details <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}