import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { PackageCheck, Truck, MapPin, Calendar, Loader2, Filter, SlidersHorizontal, X } from "lucide-react";

export default function BuyerOrders() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/orders/buyer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(o => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const vendorName = o.vendor?.name || "";
      const orderId = o._id?.toString() || "";
      const productName = o.product?.name || "";
      if (!vendorName.toLowerCase().includes(query) &&
        !orderId.toLowerCase().includes(query) &&
        !productName.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== "all" && o.status !== statusFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort functionality
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "price-high") {
      return (b.totalPrice || 0) - (a.totalPrice || 0);
    } else if (sortBy === "price-low") {
      return (a.totalPrice || 0) - (b.totalPrice || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Orders & Shipments</h2>
          <p className="text-slate-500 font-medium">Track your purchase orders and shipments in one place.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            <Filter size={16} className="text-blue-600" /> Filter
            {statusFilter !== "all" && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
          </button>
          <button
            onClick={() => setShowSortModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            <SlidersHorizontal size={16} className="text-blue-600" /> Sort By
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase text-xs tracking-widest">Loading Orders...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-900">ORD-{order._id.toString().slice(-4)}</span>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <Calendar size={14} /> {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase ${order.status === "delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      order.status === "shipped" ? "bg-blue-50 text-blue-600 border-blue-100" :
                        order.status === "cancelled" ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-slate-50 text-slate-600 border-slate-100"
                    }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <PackageCheck size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight">{order.product?.name || "Product"}</h3>
                      <p className="text-sm text-slate-500 font-medium">Vendor: {order.vendor?.name || "Unknown"}</p>
                      <p className="text-lg font-black text-blue-600 mt-1">${order.totalPrice?.toLocaleString() || "0.00"}</p>
                      <p className="text-xs text-slate-400 mt-1">Qty: {order.quantity} units</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-slate-400 mt-1" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Address</p>
                        <p className="text-xs font-bold text-slate-700">
                          {order.shippingAddress
                            ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-start gap-3">
                        <Truck size={16} className="text-slate-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking</p>
                          <p className="text-xs font-bold text-emerald-600">{order.trackingNumber}</p>
                          {order.carrier && (
                            <p className="text-xs text-slate-500">Carrier: {order.carrier}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    {order.estimatedDelivery && (
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Delivery</p>
                        <p className="text-sm font-black text-slate-900">{formatDate(order.estimatedDelivery)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredOrders.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <PackageCheck size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm tracking-tighter">No orders found</p>
            </div>
          )}
        </>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button
              onClick={() => setShowFilterModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Filter Orders</h3>
            <div className="space-y-3">
              {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilterModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
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
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Sort Orders</h3>
            <div className="space-y-3">
              {[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "price-low", label: "Price: Low to High" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${sortBy === option.value
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
