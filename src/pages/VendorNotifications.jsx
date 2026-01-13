import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Bell, CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react";

export default function VendorNotifications() {
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
      // Fetch quotes and orders to generate notifications
      const [quotesRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/quotes/vendor", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/orders/vendor", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allNotifications = [];

      // New quote requests
      quotesRes.data
        .filter(q => q.status === 'pending')
        .forEach(quote => {
          allNotifications.push({
            id: `quote-${quote._id}`,
            type: 'new_quote',
            title: 'New Quote Request',
            message: `${quote.buyer?.name || 'A buyer'} requested a quote for ${quote.product?.name || 'a product'}`,
            timestamp: quote.createdAt,
            link: '/vendor/quotes',
            unread: true
          });
        });

      // New orders
      ordersRes.data
        .filter(o => o.status === 'confirmed')
        .forEach(order => {
          allNotifications.push({
            id: `order-${order._id}`,
            type: 'new_order',
            title: 'New Order Received',
            message: `Order #${order._id.toString().slice(-4)} from ${order.buyer?.name || 'a buyer'}`,
            timestamp: order.createdAt,
            link: '/vendor/orders',
            unread: true
          });
        });

      // Orders that need shipping update
      ordersRes.data
        .filter(o => o.status === 'processing' && !o.trackingNumber)
        .forEach(order => {
          allNotifications.push({
            id: `ship-${order._id}`,
            type: 'shipping_required',
            title: 'Shipping Update Required',
            message: `Order #${order._id.toString().slice(-4)} needs tracking information`,
            timestamp: order.updatedAt,
            link: '/vendor/orders',
            unread: true
          });
        });

      // Sort by timestamp (newest first)
      allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(allNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_quote':
        return <AlertCircle size={20} className="text-blue-600" />;
      case 'new_order':
        return <CheckCircle size={20} className="text-emerald-600" />;
      case 'shipping_required':
        return <Info size={20} className="text-orange-600" />;
      default:
        return <Bell size={20} className="text-slate-600" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Notifications</h2>
          <p className="text-slate-500 font-medium">Stay updated with your business activity.</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
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
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white border rounded-3xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  notification.unread 
                    ? 'border-emerald-500 bg-emerald-50/30' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${
                    notification.unread ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-black text-slate-900 mb-1">{notification.title}</h3>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {formatTime(notification.timestamp)}
                      </span>
                      <a
                        href={notification.link}
                        className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && !loading && (
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
