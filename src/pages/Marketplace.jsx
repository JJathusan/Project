import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Card from "../components/ui/Card";
import { Filter, SlidersHorizontal, Loader2, PackageSearch } from "lucide-react";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get search query from Navbar (via Outlet context)
  const { searchQuery } = useOutletContext() || { searchQuery: "" };

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);
        // Change this URL to your actual backend endpoint
        const res = await axios.get("http://localhost:5000/api/products/all");
        setProducts(res.data);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bulk Marketplace</h2>
          <p className="text-slate-500 font-medium text-sm">Find the best wholesale prices from verified global suppliers.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm active:scale-95">
            <Filter size={16} className="text-blue-600" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm active:scale-95">
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
    </div>
  );
}