import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Plus, Package, AlertTriangle, X, Trash2, Upload, Settings } from "lucide-react";

export default function VendorInventory() {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    unit: "pcs",
    moq: 100,
    leadTime: "10-15 days",
    location: "",
    stock: "",
    price: "",
    specifications: [{ key: "", value: "" }]
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // CHANGED: /api/vendor -> /api/vendors
      const res = await axios.get("${API_BASE_URL}/api/vendors/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      if (key === 'specifications') {
        formData.append(key, JSON.stringify(newProduct.specifications));
      } else {
        formData.append(key, newProduct[key]);
      }
    });

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      // CHANGED: /api/vendor -> /api/vendors
      await axios.post("${API_BASE_URL}/api/vendors/add-product", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      setIsModalOpen(false);
      fetchInventory();
      resetForm();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Check Server Console"));
    } finally {
      setLoading(false);
    }
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...newProduct.specifications];
    updatedSpecs[index][field] = value;
    setNewProduct({ ...newProduct, specifications: updatedSpecs });
  };

  const addSpecField = () => {
    setNewProduct({
      ...newProduct,
      specifications: [...newProduct.specifications, { key: "", value: "" }]
    });
  };

  const resetForm = () => {
    setNewProduct({
      name: "", category: "", description: "", unit: "pcs",
      moq: 100, leadTime: "10-15 days", location: "", stock: "", price: "",
      specifications: [{ key: "", value: "" }]
    });
    setSelectedFiles([]);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      // CHANGED: /api/vendor -> /api/vendors
      await axios.delete(`${API_BASE_URL}/api/vendors/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory(); 
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inventory</h2>
          <p className="text-slate-500 font-medium text-sm">Manage your TradeFlow stock.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg uppercase active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.images?.[0] ? `${API_BASE_URL}${item.images[0]}` : 'https://via.placeholder.com/40'} 
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100" 
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-[10px] text-slate-500 uppercase">{item.category}</td>
                  <td className="px-6 py-4 font-bold text-sm">{item.stock} {item.unit}</td>
                  <td className="px-6 py-4 font-bold text-sm text-emerald-600">${item.price}</td>
                  <td className="px-6 py-4"><StatusBadge stock={item.stock} /></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteProduct(item._id)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Launch New Product</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Product Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                <input required placeholder="Category" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Product Images (Device)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                    <Upload className="text-slate-400 mb-2" size={24} />
                    <p className="text-xs text-slate-500 font-bold">Upload from device</p>
                    <input type="file" multiple className="hidden" onChange={(e) => setSelectedFiles([...e.target.files])} />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Settings size={14}/> Specifications</label>
                  <button type="button" onClick={addSpecField} className="text-emerald-600 text-[10px] font-black uppercase hover:underline">+ Add</button>
                </div>
                {newProduct.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input placeholder="Key (e.g. Material)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} />
                    <input placeholder="Value (e.g. Cotton)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input type="number" placeholder="Price" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                <input placeholder="Stock" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
                <input placeholder="MOQ" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newProduct.moq} onChange={(e) => setNewProduct({...newProduct, moq: e.target.value})} />
                <input placeholder="Unit" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} />
              </div>

              <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase hover:bg-emerald-600 transition-all">
                {loading ? "Listing..." : "Confirm & List Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ stock }) {
  const qty = parseInt(stock) || 0;
  let label = qty > 50 ? "In Stock" : qty > 0 ? "Low Stock" : "Out of Stock";
  let style = qty > 50 ? "bg-emerald-50 text-emerald-600" : qty > 0 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600";
  return <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${style}`}>{label}</span>;
}