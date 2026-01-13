import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Store, ShoppingBag, Shield, TrendingUp, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalBuyers: 0,
    totalAdmins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase text-xs tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={24} />,
      color: "bg-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      onClick: () => navigate("/admin/users")
    },
    {
      title: "Vendors",
      value: stats.totalVendors,
      icon: <Store size={24} />,
      color: "bg-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      onClick: () => navigate("/admin/vendors")
    },
    {
      title: "Buyers",
      value: stats.totalBuyers,
      icon: <ShoppingBag size={24} />,
      color: "bg-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      onClick: () => navigate("/admin/buyers")
    },
    {
      title: "Admins",
      value: stats.totalAdmins,
      icon: <Shield size={24} />,
      color: "bg-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      onClick: () => navigate("/admin/users")
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h2>
        <p className="text-slate-500 font-medium">Manage all vendors and buyers from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <button
            key={index}
            onClick={card.onClick}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-2xl`}>
                <div className={card.textColor}>
                  {card.icon}
                </div>
              </div>
              <TrendingUp size={16} className="text-slate-400 group-hover:text-slate-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{card.value}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-6 uppercase">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left border border-slate-200"
          >
            <Users size={20} className="text-indigo-600 mb-2" />
            <h4 className="font-black text-slate-900 mb-1">View All Users</h4>
            <p className="text-xs text-slate-500">Manage all users in the system</p>
          </button>
          <button
            onClick={() => navigate("/admin/vendors")}
            className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left border border-slate-200"
          >
            <Store size={20} className="text-emerald-600 mb-2" />
            <h4 className="font-black text-slate-900 mb-1">Manage Vendors</h4>
            <p className="text-xs text-slate-500">View and edit vendor accounts</p>
          </button>
          <button
            onClick={() => navigate("/admin/buyers")}
            className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left border border-slate-200"
          >
            <ShoppingBag size={20} className="text-blue-600 mb-2" />
            <h4 className="font-black text-slate-900 mb-1">Manage Buyers</h4>
            <p className="text-xs text-slate-500">View and edit buyer accounts</p>
          </button>
        </div>
      </div>
    </div>
  );
}
