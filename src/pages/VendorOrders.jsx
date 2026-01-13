import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { 
  Truck, 
  PackageCheck, 
  MapPin, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Loader2,
  X
} from "lucide-react";

export default function VendorOrders() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: ""
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/orders/vendor", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowUpdateModal(null);
      setUpdateData({ status: "", trackingNumber: "", carrier: "", estimatedDelivery: "" });
      fetchOrders();
      alert("Order updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order");
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
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const buyerName = o.buyer?.name || "";
    const orderId = o._id?.toString() || "";
    return buyerName.toLowerCase().includes(query) ||
           orderId.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sales Orders</h2>
        <p className="text-slate-500 font-medium">Track fulfillment, shipping status, and payments.</p>
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
          <div key={order.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Top Bar */}
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-900">ORD-{order._id.toString().slice(-4)}</span>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <Calendar size={14} /> {formatDate(order.createdAt)}
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
                  <h3 className="font-black text-slate-900 leading-tight">{order.product?.name || "Product"}</h3>
                  <p className="text-sm text-slate-500 font-medium">Buyer: {order.buyer?.name || "Unknown"}</p>
                  <p className="text-lg font-black text-emerald-600 mt-1">${order.totalPrice?.toLocaleString() || "0.00"}</p>
                  <p className="text-xs text-slate-400 mt-1">Qty: {order.quantity} units</p>
                </div>
              </div>

              {/* Logistics */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                    <p className="text-xs font-bold text-slate-700">
                      {order.shippingAddress 
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={16} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</p>
                    <p className="text-xs font-bold text-slate-700">{order.carrier || "Not assigned"}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-emerald-600 mt-1">Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-col justify-center items-end gap-4">
                <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-[0.15em] ${
                  order.status === "shipped" || order.status === "delivered" 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : order.status === "cancelled"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                <button 
                  onClick={() => {
                    setShowUpdateModal(order._id);
                    setUpdateData({
                      status: order.status,
                      trackingNumber: order.trackingNumber || "",
                      carrier: order.carrier || "",
                      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ""
                    });
                  }}
                  className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  Update Status <ChevronRight size={16} />
                </button>
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

      {/* Update Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button 
              onClick={() => {
                setShowUpdateModal(null);
                setUpdateData({ status: "", trackingNumber: "", carrier: "", estimatedDelivery: "" });
              }} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Update Order Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Status *</label>
                <select 
                  value={updateData.status}
                  onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Tracking Number</label>
                <input 
                  type="text" 
                  value={updateData.trackingNumber}
                  onChange={(e) => setUpdateData({...updateData, trackingNumber: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Carrier</label>
                <input 
                  type="text" 
                  value={updateData.carrier}
                  onChange={(e) => setUpdateData({...updateData, carrier: e.target.value})}
                  placeholder="e.g., Maersk Logistics"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Estimated Delivery</label>
                <input 
                  type="date" 
                  value={updateData.estimatedDelivery}
                  onChange={(e) => setUpdateData({...updateData, estimatedDelivery: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>
              <button 
                onClick={() => handleUpdateStatus(showUpdateModal)}
                disabled={!updateData.status}
                className="w-full py-4 bg-emerald-600 disabled:bg-slate-100 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}