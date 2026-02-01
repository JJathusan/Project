import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Building2, Package, ShoppingCart, DollarSign, ArrowLeft } from "lucide-react";

export default function AdminVendorDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/vendors/admin/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [id]);

  if (loading) return <div className="p-10">Loading Vendor Intelligence...</div>;
  if (!data) return <div className="p-10">Vendor data not found.</div>;

  return (
    <div className="space-y-6 p-6">
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-500 font-bold hover:text-black">
        <ArrowLeft size={16} /> Back to Vendors
      </button>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 text-white p-6 rounded-[2rem]">
          <DollarSign className="mb-2" />
          <p className="text-xs uppercase font-black opacity-80">Total Revenue</p>
          <p className="text-3xl font-black">${data.stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border p-6 rounded-[2rem]">
          <Package className="text-blue-500 mb-2" />
          <p className="text-xs uppercase font-black text-slate-400">Total Products</p>
          <p className="text-3xl font-black">{data.stats.totalProducts}</p>
        </div>
        <div className="bg-white border p-6 rounded-[2rem]">
          <ShoppingCart className="text-purple-500 mb-2" />
          <p className="text-xs uppercase font-black text-slate-400">Orders Processed</p>
          <p className="text-3xl font-black">{data.stats.totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white border rounded-[2rem] p-8">
          <h3 className="text-lg font-black uppercase mb-4 border-b pb-2">Business Profile</h3>
          <div className="space-y-3">
            <p><strong>Company:</strong> {data.profile?.companyName}</p>
            <p><strong>Reg Number:</strong> {data.profile?.businessRegNumber}</p>
            <p><strong>Industry:</strong> {data.profile?.industry}</p>
            <p><strong>Location:</strong> {data.profile?.country}</p>
            <p><strong>Address:</strong> {data.profile?.officeAddress}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border rounded-[2rem] p-8">
          <h3 className="text-lg font-black uppercase mb-4 border-b pb-2">Recent Orders</h3>
          <div className="max-h-60 overflow-y-auto">
            {data.orders.map(order => (
              <div key={order._id} className="flex justify-between py-2 border-b text-sm">
                <span>{order.buyer?.name}</span>
                <span className="font-bold">${order.totalPrice}</span>
                <span className="text-[10px] bg-slate-100 px-2 rounded-full uppercase">{order.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}