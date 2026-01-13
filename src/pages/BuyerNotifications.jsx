import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Bell, CheckCircle, XCircle, AlertCircle, Info, Truck, Loader2 } from "lucide-react";

export default function BuyerNotifications() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [quotesRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/quotes/buyer", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/orders/buyer", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allNotifications = [];

      // Quote responses from vendors
      quotesRes.data
        .filter(q => ["quoted", "negotiating", "accepted", "declined", "expired"].includes(q.status))
        .forEach(quote => {
          allNotifications.push({
            id: `quote-${quote._id}`,
            type: quote.status === "declined" ? "quote_declined" : "quote_response",
            title: "Quote Update",
            message: `${quote.vendor?.name || "Vendor"} ${statusLabel(quote.status)} your request for ${quote.product?.name || "a product"}`,
            timestamp: quote.updatedAt || quote.createdAt,
            link: "/buyer/rfqs",
            unread: true
          });
        });

      // Order status updates
      ordersRes.data.forEach(order => {
        allNotifications.push({
          id: `order-${order._id}`,
          type: "order_status",
          title: "Order Update",
          message: `Order #${order._id.toString().slice(-4)} is now ${order.status}`,
          timestamp: order.updatedAt || order.createdAt,
          link: "/buyer/orders",
          unread: true
        });

        // Shipping/tracking updates
        if (order.trackingNumber) {
          allNotifications.push({
            id: `ship-${order._id}`,
            type: "shipping_update",
            title: "Shipment Update",
            message: `Tracking ${order.trackingNumber} (${order.carrier || "Carrier TBD"})`,
            timestamp: order.updatedAt || order.createdAt,
            link: "/buyer/orders",
            unread: true
          });
        }
      });

      allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setNotifications(allNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "quoted":
        return "responded to";
      case "negotiating":
        return "updated";
      case "accepted":
        return "accepted";
      case "declined":
        return "declined";
      case "expired":
        return "expired for";
      default:
        return "updated";
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "quote_response":
        return <AlertCircle size={20} className="text-blue-600" />;
      case "quote_declined":
        return <XCircle size={20} className="text-red-600" />;
      case "order_status":
        return <CheckCircle size={20} className="text-emerald-600" />;
      case "shipping_update":
        return <Truck size={20} className="text-indigo-600" />;
      default:
        return <Bell size={20} className="text-slate-600" />;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.message?.toLowerCase().includes(q) ||
      n.type?.toLowerCase().includes(q)
    );
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Notifications</h2>
          <p className="text-slate-500 font-medium">Stay updated on your quotes and orders.</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <span className="text-sm font-black uppercase">{unreadCount} Unread</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase text-xs tracking-widest">Loading Notifications...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white border rounded-3xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  notification.unread
                    ? "border-blue-500 bg-blue-50/30"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      notification.unread ? "bg-blue-100" : "bg-slate-100"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-black text-slate-900 mb-1">{notification.title}</h3>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {formatTime(notification.timestamp)}
                      </span>
                      <a
                        href={notification.link}
                        className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Bell size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm tracking-tighter">No notifications</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
