import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Plus, Package, AlertTriangle, X, MoreVertical, Trash2 } from "lucide-react";

export default function VendorInventory() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    unit: "",
    moq: 100,
    leadTime: "10-15 days",
    location: "",
    stock: "",
    price: "",
    images: [""]
  });

  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";

  // 1. Fetch Inventory
  const fetchInventory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/vendor/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // 2. Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const payload = {
      ...newProduct,
      moq: Number(newProduct.moq),
      images: newProduct.images.filter(img => img.trim() !== ""),
      stockValue: 100
    };

    try {
      await axios.post("http://localhost:5000/api/vendor/add-product", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchInventory();
      setNewProduct({
        name: "", category: "", description: "", unit: "",
        moq: 100, leadTime: "10-15 days", location: "", stock: "", price: "", images: [""]
      });
    } catch (err) {
      alert("Failed to add product: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/vendor/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory(); 
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 4. Quick Update (Inline Edit)
  const handleQuickUpdate = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/vendor/product/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory(); // Refresh to update status badges
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inventory</h2>
          <p className="text-slate-500 font-medium text-sm">Real-time stock management and pricing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock (Edit)</th>
                <th className="px-6 py-4">Price (Edit)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.location || "Global"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-[10px] text-slate-500 uppercase">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      className="w-24 bg-transparent font-black text-sm text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none transition-all"
                      defaultValue={item.stock}
                      onBlur={(e) => handleQuickUpdate(item._id, { stock: e.target.value })}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      className="w-24 bg-transparent font-black text-sm text-emerald-600 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none transition-all"
                      defaultValue={item.price}
                      onBlur={(e) => handleQuickUpdate(item._id, { price: e.target.value })}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge stock={item.stock} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteProduct(item._id)} 
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInventory.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                No products in inventory
            </div>
          )}
        </div>
      </div>

      {/* Modal - Remains same but with cleaned styles */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Launch New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Product Name" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                <input required placeholder="Category" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
              </div>
              <textarea required placeholder="Description" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 h-24 text-slate-900 placeholder:text-slate-400" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input placeholder="Unit (e.g. kg, pcs, boxes)" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} />
                <input type="number" placeholder="MOQ" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.moq} onChange={(e) => setNewProduct({...newProduct, moq: e.target.value})} />
                <input placeholder="Location" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.location} onChange={(e) => setNewProduct({...newProduct, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Stock (e.g. 500)" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
                <input placeholder="Price (e.g. $10)" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <input placeholder="Image URL" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400" value={newProduct.images[0]} onChange={(e) => {
                const imgs = [...newProduct.images];
                imgs[0] = e.target.value;
                setNewProduct({...newProduct, images: imgs});
              }} />
              <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50">
                {loading ? "Processing..." : "Confirm & List Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. Dynamic Status Badge
function StatusBadge({ stock }) {
  const qty = parseInt(stock) || 0;
  let label = "In Stock";
  let style = "bg-emerald-50 text-emerald-600 border-emerald-100";

  if (qty <= 0) {
    label = "Out of Stock";
    style = "bg-red-50 text-red-600 border-red-100";
  } else if (qty < 50) {
    label = "Low Stock";
    style = "bg-orange-50 text-orange-600 border-orange-100";
  }

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border flex items-center gap-1.5 w-fit ${style}`}>
      {label === "Low Stock" && <AlertTriangle size={10} />}
      {label}
    </span>
  );
}