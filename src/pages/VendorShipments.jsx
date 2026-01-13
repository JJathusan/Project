import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Truck, PackageCheck, MapPin, Calendar, Loader2, ExternalLink } from "lucide-react";

export default function VendorShipments() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/orders/vendor", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter orders that are in shipping status
      const shippingOrders = res.data.filter(order =>
        ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
      );

      setShipments(shippingOrders);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipped':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredShipments = shipments.filter(s => {
    const buyerName = s.buyer?.name || "";
    const orderId = s._id?.toString() || "";
    return buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Shipments</h2>
        <p className="text-slate-500 font-medium">Track and manage all your shipments.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase text-xs tracking-widest">Loading Shipments...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {filteredShipments.map((shipment) => (
              <div key={shipment._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <Truck size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-900">SHIP-{shipment._id.toString().slice(-4)}</span>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mt-1">
                        <Calendar size={12} /> {formatDate(shipment.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase ${getStatusColor(shipment.status)}`}>
                    {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <PackageCheck size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight">{shipment.product?.name || "Product"}</h3>
                      <p className="text-sm text-slate-500 font-medium">Buyer: {shipment.buyer?.name || "Unknown"}</p>
                      <p className="text-lg font-black text-emerald-600 mt-1">${shipment.totalPrice?.toLocaleString() || "0.00"}</p>
                      <p className="text-xs text-slate-400 mt-1">Qty: {shipment.quantity} units</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-slate-400 mt-1" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                        <p className="text-xs font-bold text-slate-700">
                          {shipment.shippingAddress
                            ? `${shipment.shippingAddress.city}, ${shipment.shippingAddress.country}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                    {shipment.trackingNumber && (
                      <div className="flex items-start gap-3">
                        <Truck size={16} className="text-slate-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking</p>
                          <p className="text-xs font-bold text-emerald-600">{shipment.trackingNumber}</p>
                          {shipment.carrier && (
                            <p className="text-xs text-slate-500">Carrier: {shipment.carrier}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    {shipment.estimatedDelivery && (
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Delivery</p>
                        <p className="text-sm font-black text-slate-900">{formatDate(shipment.estimatedDelivery)}</p>
                      </div>
                    )}
                    <a
                      href={`/vendor/orders`}
                      className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      View Order <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredShipments.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Truck size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm tracking-tighter">No shipments found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
