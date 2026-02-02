import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Users, Store, ShoppingBag, Shield, TrendingUp, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalBuyers: 0,
    totalAdmins: 0
  });
  const [loading, setLoading] = useState(true);
  const [pendingVendors, setPendingVendors] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPendingVendors();
  }, []);

  // --- Logic to check profile completion (Handles Small Vendors) ---
  const getProfileStatus = (vendor) => {
    const requirements = [
      { label: "Company Name", met: !!vendor.companyName, critical: true },
      { label: "Business Email", met: !!vendor.user?.email, critical: true },
      { label: "Phone Number", met: !!vendor.phone, critical: true },
      { label: "Tax ID / VAT", met: !!vendor.taxId, critical: false }, 
      { label: "Warehouse Address", met: !!vendor.address, critical: false },
    ];

    const missingCritical = requirements.filter(r => r.critical && !r.met);
    const missingOptional = requirements.filter(r => !r.critical && !r.met);
    const totalMet = requirements.filter(r => r.met).length;
    const score = Math.round((totalMet / requirements.length) * 100);

    return {
      canApprove: missingCritical.length === 0,
      hasWarnings: missingOptional.length > 0,
      missingLabels: missingCritical.map(m => m.label),
      score
    };
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await axios.get("${API_BASE_URL}/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingVendors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("${API_BASE_URL}/api/admin/vendors/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingVendors(res.data);
    } catch (err) {
      console.error("Error fetching pending vendors", err);
    }
  };

  const handleVerify = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/verify-vendor/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingVendors();
      fetchStats();
    } catch (err) {
      alert("Verification failed: " + (err.response?.data?.message || err.message));
    }
  };

  // --- New Rejection Function ---
  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this vendor? This will remove them from the pending list.")) return;
    
    const token = localStorage.getItem("token");
    try {
      // Assuming your backend has a reject endpoint, if not, this can be mapped to a 'rejected' status
      await axios.patch(`${API_BASE_URL}/api/admin/reject-vendor/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingVendors();
      fetchStats();
    } catch (err) {
      alert("Rejection failed: " + (err.response?.data?.message || err.message));
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
    { title: "Total Users", value: stats.totalUsers, icon: <Users size={24} />, color: "bg-indigo-600", bgColor: "bg-indigo-50", textColor: "text-indigo-600", onClick: () => navigate("/admin/users") },
    { title: "Vendors", value: stats.totalVendors, icon: <Store size={24} />, color: "bg-emerald-600", bgColor: "bg-emerald-50", textColor: "text-emerald-600", onClick: () => navigate("/admin/vendors") },
    { title: "Buyers", value: stats.totalBuyers, icon: <ShoppingBag size={24} />, color: "bg-blue-600", bgColor: "bg-blue-50", textColor: "text-blue-600", onClick: () => navigate("/admin/buyers") },
    { title: "Admins", value: stats.totalAdmins, icon: <Shield size={24} />, color: "bg-purple-600", bgColor: "bg-purple-50", textColor: "text-purple-600", onClick: () => navigate("/admin/users") }
  ];

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h2>
        <p className="text-slate-500 font-medium">Manage all vendors and buyers from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <button key={index} onClick={card.onClick} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-2xl`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
              <TrendingUp size={16} className="text-slate-400 group-hover:text-slate-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{card.value}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
          </button>
        ))}
      </div>

      {/* PENDING VERIFICATIONS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Shield size={20} className="text-amber-500" /> Pending Verifications
          </h3>
          <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            {pendingVendors.length} New Requests
          </span>
        </div>

        {pendingVendors.length === 0 ? (
          <p className="text-sm text-slate-400 font-bold italic">No vendors currently awaiting verification.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingVendors.map((vendor) => {
              const status = getProfileStatus(vendor);
              return (
                <div key={vendor._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-slate-900">{vendor.companyName}</p>
                      {status.score === 100 ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={16} className={`${status.canApprove ? 'text-amber-500' : 'text-red-500'}`} />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{vendor.user?.email || "No email"}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${status.score === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${status.score}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{status.score}% Profile</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!status.canApprove && (
                      <div className="flex flex-col items-end">
                        <p className="text-[9px] font-black text-red-500 uppercase px-2 py-1 bg-red-50 rounded border border-red-100 mb-1">Critical Missing</p>
                        <p className="text-[8px] text-slate-400 font-bold">{status.missingLabels.join(", ")}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReject(vendor.user?._id)}
                        className="p-2.5 bg-white border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all shadow-sm"
                        title="Reject Vendor"
                      >
                        <XCircle size={18} />
                      </button>

                      <button 
                        onClick={() => handleVerify(vendor.user?._id)}
                        disabled={!status.canApprove}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${
                          status.canApprove 
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200" 
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {status.hasWarnings && status.canApprove ? "Verify (Incomplete)" : "Approve Vendor"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-6 uppercase">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate("/admin/users")} className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left border border-slate-200">
            <Users size={20} className="text-indigo-600 mb-2" />
            <h4 className="font-black text-slate-900 mb-1">View All Users</h4>
            <p className="text-xs text-slate-500">Manage all users in the system</p>
          </button>
          <button onClick={() => navigate("/admin/vendors")} className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left border border-slate-200">
            <Store size={20} className="text-emerald-600 mb-2" />
            <h4 className="font-black text-slate-900 mb-1">Manage Vendors</h4>
            <p className="text-xs text-slate-500">View and edit vendor accounts</p>
          </button>
          <button onClick={() => navigate("/admin/buyers")} className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-left border border-slate-200">
            <ShoppingBag size={20} className="text-blue-600 mb-2" />
            <h4 className="font-black text-slate-900 mb-1">Manage Buyers</h4>
            <p className="text-xs text-slate-500">View and edit buyer accounts</p>
          </button>
        </div>
      </div>
    </div>
  );
}