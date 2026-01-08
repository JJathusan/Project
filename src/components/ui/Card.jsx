import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Package, Info } from "lucide-react";

export default function Card({ product }) {
  const navigate = useNavigate();

  // Redirect to the dynamic detail page using the MongoDB _id
  const handleCardClick = () => {
    if (product._id) {
      navigate(`/product/${product._id}`);
    } else {
      console.error("Product ID is missing", product);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer"
    >
      {/* 1. Image Section */}
      <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <Package size={40} className="mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest">No Image Available</span>
          </div>
        )}
        
        {/* Floating Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-md border border-slate-100 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-tighter shadow-sm">
            {product.category || "General"}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate pr-2">
            {product.name}
          </h3>
          <Info size={14} className="text-slate-300" />
        </div>

        {/* Price & Unit */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            / {product.unit || "unit"}
          </span>
        </div>

        {/* MOQ Stats */}
        <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
            <span className="text-slate-400">Min Order</span>
            <span className="text-slate-900">{product.moq} {product.unit}s</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-3/4 rounded-full"></div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-lg active:scale-95">
          View Details <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}