import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  DollarSign,
  ArrowRight,
  Loader2,
  X
} from "lucide-react";

// THIS LINE IS CRITICAL: Must be 'export default'
export default function VendorQuotes() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseModal, setShowResponseModal] = useState(null);
  const [responseData, setResponseData] = useState({ price: "", message: "" });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/quotes/vendor", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuotes(res.data);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (quoteId, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/quotes/${quoteId}/respond`,
        {
          vendorPrice: parseFloat(responseData.price),
          vendorResponse: responseData.message,
          status: status
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowResponseModal(null);
      setResponseData({ price: "", message: "" });
      fetchQuotes();
      alert("Quote response submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit response");
    }
  };

  const handleDecline = async (quoteId) => {
    if (!window.confirm("Are you sure you want to decline this quote?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/quotes/${quoteId}/respond`,
        { status: "declined" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuotes();
    } catch (err) {
      alert("Failed to decline quote");
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "New Request",
      quoted: "Quoted",
      negotiating: "Negotiating",
      accepted: "Accepted",
      declined: "Declined",
      expired: "Expired"
    };
    return statusMap[status] || status;
  };

  const getExpiryText = (expiresAt) => {
    if (!expiresAt) return "No expiry";
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const filteredQuotes = quotes.filter(q => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const buyerName = q.buyer?.name || "";
    const productName = q.product?.name || "";
    return buyerName.toLowerCase().includes(query) ||
      productName.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Quotes & RFQs</h2>
          <p className="text-slate-500 font-medium">Respond to buyer inquiries and manage price negotiations.</p>
        </div>
        <div className="flex gap-3 text-xs font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Active: {quotes.filter(q => q.status === 'pending' || q.status === 'quoted' || q.status === 'negotiating').length}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase text-xs tracking-widest">Loading Quotes...</p>
        </div>
      ) : (
        <>
          {/* Quote Cards */}
          <div className="grid gap-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                  {/* Request Info */}
                  <div className="flex items-start gap-5">
                    <div className={`p-4 rounded-2xl ${quote.status === "New Request" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
                      }`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RFQ-{quote._id.toString().slice(-4)}</span>
                        <StatusBadge status={quote.status} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {quote.product?.name || "Product"}
                      </h3>
                      <p className="text-sm font-bold text-slate-500">Buyer: {quote.buyer?.name || "Unknown"}</p>
                      {quote.message && (
                        <p className="text-xs text-slate-400 mt-1 italic">"{quote.message}"</p>
                      )}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                      <p className="text-sm font-black text-slate-900">{quote.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Value</p>
                      <p className="text-sm font-black text-emerald-600">
                        {quote.vendorPrice ? `$${(quote.vendorPrice * quote.quantity).toLocaleString()}` : "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Limit</p>
                      <div className="flex items-center gap-1.5 text-sm font-black text-slate-700">
                        <Clock size={14} className="text-orange-500" />
                        {getExpiryText(quote.expiresAt)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {quote.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleDecline(quote._id)}
                          className="flex-1 lg:flex-none px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => setShowResponseModal(quote._id)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-100 transition-all active:scale-95 group-hover:bg-emerald-600"
                        >
                          Send Quote <ArrowRight size={16} />
                        </button>
                      </>
                    )}
                    {quote.status === 'quoted' && (
                      <div className="text-xs font-black text-emerald-600 uppercase">Quote Sent</div>
                    )}
                    {quote.status === 'declined' && (
                      <div className="text-xs font-black text-red-600 uppercase">Declined</div>
                    )}
                    {quote.status === 'accepted' && (
                      <div className="text-xs font-black text-blue-600 uppercase">Accepted - Order Created</div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {filteredQuotes.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm tracking-tighter">No quotes found</p>
            </div>
          )}
        </>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowResponseModal(null);
                setResponseData({ price: "", message: "" });
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Send Quote</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Price per Unit ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={responseData.price}
                  onChange={(e) => setResponseData({ ...responseData, price: e.target.value })}
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Message (Optional)</label>
                <textarea
                  value={responseData.message}
                  onChange={(e) => setResponseData({ ...responseData, message: e.target.value })}
                  placeholder="Add any notes or terms..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 h-24 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => handleRespond(showResponseModal, 'quoted')}
                disabled={!responseData.price}
                className="w-full py-4 bg-emerald-600 disabled:bg-slate-100 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
              >
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const statusMap = {
    pending: "bg-blue-50 text-blue-600 border-blue-100",
    quoted: "bg-purple-50 text-purple-600 border-purple-100",
    negotiating: "bg-purple-50 text-purple-600 border-purple-100",
    accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    declined: "bg-red-50 text-red-600 border-red-100",
    expired: "bg-slate-100 text-slate-500 border-slate-200",
  };

  const labelMap = {
    pending: "New Request",
    quoted: "Quoted",
    negotiating: "Negotiating",
    accepted: "Accepted",
    declined: "Declined",
    expired: "Expired"
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${statusMap[status] || statusMap.pending}`}>
      {labelMap[status] || status}
    </span>
  );
}