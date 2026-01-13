import React, { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, Package, MessageSquareQuote, Users, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/vendor/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 font-black animate-pulse">LOADING ANALYTICS...</div>;

  const statsCards = [
    { label: "Revenue (MTD)", value: data?.revenue, grow: "+12%", color: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp size={20} /> },
    { label: "Active Quotes", value: data?.activeQuotes, grow: "+2", color: "text-blue-600", bg: "bg-blue-50", icon: <MessageSquareQuote size={20} /> },
    { label: "Pending Shipments", value: data?.pendingShipments, grow: "Critical", color: "text-orange-600", bg: "bg-orange-50", icon: <Package size={20} /> },
    { label: "New RFQs", value: data?.newRFQs, grow: "+5", color: "text-purple-600", bg: "bg-purple-50", icon: <Users size={20} /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vendor Console</h2>
        <p className="text-slate-500 font-medium">Welcome back, {localStorage.getItem("userName")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
               <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${stat.bg} ${stat.color}`}>{stat.grow}</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent RFQs */}
        <RecentRFQs />

        {/* Dynamic Inventory Health */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-500"/> Inventory Health
          </h3>
          <div className="space-y-6">
            {data?.inventoryHealth.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                   <span className="text-slate-500">{item.name}</span>
                   <span className={item.health < 20 ? "text-red-600" : "text-emerald-600"}>{item.health}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className={`h-full rounded-full ${item.health < 20 ? "bg-red-500" : "bg-emerald-500"}`} 
                    style={{ width: `${item.health}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentRFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRFQs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/quotes/vendor", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Get latest 5 RFQs
        setRfqs(res.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch RFQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRFQs();
  }, []);

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Recent RFQs</h3>
        <button
          onClick={() => navigate("/vendor/quotes")}
          className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
        >
          View All →
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-slate-400 font-bold">Loading...</div>
      ) : rfqs.length > 0 ? (
        <div className="space-y-3">
          {rfqs.map((rfq) => (
            <div
              key={rfq._id}
              onClick={() => navigate("/vendor/quotes")}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{rfq.product?.name || "Product"}</p>
                  <p className="text-xs text-slate-500">From: {rfq.buyer?.name || "Unknown"}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                  rfq.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                  rfq.status === 'quoted' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {rfq.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 font-bold">No RFQs yet</div>
      )}
    </div>
  );
}