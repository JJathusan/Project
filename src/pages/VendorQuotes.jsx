import React from "react";
import { useOutletContext } from "react-router-dom";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  DollarSign,
  ArrowRight
} from "lucide-react";

// THIS LINE IS CRITICAL: Must be 'export default'
export default function VendorQuotes() {
  const context = useOutletContext() || {};
  const searchQuery = context.searchQuery || "";

  const quotes = [
    { 
      id: "RFQ-8821", 
      buyer: "Global Fabrics Ltd", 
      product: "Premium Raw Cotton", 
      quantity: "500 Tons", 
      value: "$600,000", 
      expiry: "24h left", 
      status: "New Request" 
    },
    { 
      id: "RFQ-7740", 
      buyer: "BuildRight Inc", 
      product: "Industrial Steel Pipes", 
      quantity: "2,000 Units", 
      value: "$120,000", 
      expiry: "3 days left", 
      status: "Negotiating" 
    },
    { 
      id: "RFQ-6612", 
      buyer: "EnergyFlow Co", 
      product: "Solar Panels X1", 
      quantity: "150 Units", 
      value: "$22,500", 
      expiry: "Expired", 
      status: "Closed" 
    }
  ];

  const filteredQuotes = quotes.filter(q => 
    q.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Active: 12
            </div>
        </div>
      </div>

      {/* Quote Cards */}
      <div className="grid gap-4">
        {filteredQuotes.map((quote) => (
          <div key={quote.id} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Request Info */}
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-2xl ${
                  quote.status === "New Request" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
                }`}>
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quote.id}</span>
                    <StatusBadge status={quote.status} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {quote.product}
                  </h3>
                  <p className="text-sm font-bold text-slate-500">Buyer: {quote.buyer}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                  <p className="text-sm font-black text-slate-900">{quote.quantity}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Value</p>
                  <p className="text-sm font-black text-emerald-600">{quote.value}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Limit</p>
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-700">
                    <Clock size={14} className="text-orange-500" />
                    {quote.expiry}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button className="flex-1 lg:flex-none px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                  Decline
                </button>
                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-100 transition-all active:scale-95 group-hover:bg-emerald-600">
                  Send Quote <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "New Request": "bg-blue-50 text-blue-600 border-blue-100",
    "Negotiating": "bg-purple-50 text-purple-600 border-purple-100",
    "Closed": "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
}