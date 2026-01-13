import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BuyerRFQs() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/quotes/buyer", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuotes(res.data);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Accept this quote and create an order?")) return;

    try {
      await axios.post(
        `http://localhost:5000/api/quotes/${quoteId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quote accepted! Order created successfully.");
      fetchQuotes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept quote");
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Pending",
      quoted: "Quoted",
      negotiating: "Negotiating",
      accepted: "Accepted",
      declined: "Declined",
      expired: "Expired"
    };
    return statusMap[status] || status;
  };

  const filteredQuotes = quotes.filter(q => {
    const vendorName = q.vendor?.name || "";
    const productName = q.product?.name || "";
    return vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           productName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My RFQs</h2>
        <p className="text-slate-500 font-medium">Track your quote requests and vendor responses.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold uppercase text-xs tracking-widest">Loading RFQs...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredQuotes.map((quote) => (
              <div key={quote._id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{quote.product?.name || "Product"}</h3>
                    <p className="text-sm text-slate-500">Vendor: {quote.vendor?.name || "Unknown"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    quote.status === 'quoted' ? 'bg-blue-50 text-blue-600' :
                    quote.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                    quote.status === 'declined' ? 'bg-red-50 text-red-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {getStatusLabel(quote.status)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Quantity</p>
                    <p className="text-sm font-black">{quote.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Vendor Price</p>
                    <p className="text-sm font-black text-emerald-600">
                      {quote.vendorPrice ? `$${quote.vendorPrice.toFixed(2)}/unit` : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Total</p>
                    <p className="text-sm font-black">
                      {quote.totalPrice ? `$${quote.totalPrice.toLocaleString()}` : "N/A"}
                    </p>
                  </div>
                </div>
                {quote.vendorResponse && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-black text-slate-400 uppercase mb-2">Vendor Response</p>
                    <p className="text-sm text-slate-700">{quote.vendorResponse}</p>
                  </div>
                )}
                {quote.status === 'quoted' && (
                  <button
                    onClick={() => handleAcceptQuote(quote._id)}
                    className="w-full py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    Accept Quote & Create Order
                  </button>
                )}
              </div>
            ))}
          </div>
          {filteredQuotes.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase text-sm tracking-tighter">No RFQs found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
