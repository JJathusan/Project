import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Card from "../components/ui/Card";
import { Filter, SlidersHorizontal, Loader2, PackageSearch, X } from "lucide-react";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Get search query from Navbar (via Outlet context)
  const { searchQuery } = useOutletContext() || { searchQuery: "" };

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products/all");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  // Get all unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products.filter((p) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!(p.name && p.name.toLowerCase().includes(query)) &&
          !(p.category && p.category.toLowerCase().includes(query))) {
        return false;
      }
    }
    
    // Category filter
    if (categoryFilter !== "all" && p.category !== categoryFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort functionality
    if (sortBy === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    } else if (sortBy === "price-high") {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0);
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0);
      return priceB - priceA;
    } else if (sortBy === "price-low") {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0);
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0);
      return priceA - priceB;
    } else if (sortBy === "name-asc") {
      return (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "name-desc") {
      return (b.name || "").localeCompare(a.name || "");
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bulk Marketplace</h2>
          <p className="text-slate-500 font-medium text-sm">Find the best wholesale prices from verified global suppliers.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            <Filter size={16} className="text-blue-600" /> Filter
            {categoryFilter !== "all" && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
          </button>
          <button 
            onClick={() => setShowSortModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            <SlidersHorizontal size={16} className="text-blue-600" /> Sort By
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase text-xs tracking-widest">Loading Marketplace...</p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <Card key={p._id} product={p} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <PackageSearch size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm tracking-tighter">No products found matching "{searchQuery}"</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-blue-600 text-xs font-black uppercase hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowFilterModal(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Filter Products</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setShowFilterModal(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  categoryFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setCategoryFilter(category);
                    setShowFilterModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                    categoryFilter === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowSortModal(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Sort Products</h3>
            <div className="space-y-3">
              {[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "name-asc", label: "Name: A to Z" },
                { value: "name-desc", label: "Name: Z to A" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                    sortBy === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}