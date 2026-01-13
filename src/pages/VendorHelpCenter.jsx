import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { HelpCircle, Book, MessageSquare, FileText, Search, ChevronRight, Settings } from "lucide-react";

export default function VendorHelpCenter() {
  const context = useOutletContext() || {};
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I add products to my inventory?",
          a: "Navigate to the Inventory page from the sidebar, then click 'Add New Product'. Fill in all required fields including product name, category, price, and stock information."
        },
        {
          q: "How do I respond to quote requests?",
          a: "Go to the Quotes & RFQs page. You'll see all pending quote requests. Click 'Send Quote' on any request to provide your pricing and terms."
        },
        {
          q: "How do I update order status?",
          a: "Visit the Sales Orders page, find the order you want to update, and click 'Update Status'. You can add tracking numbers, carrier information, and estimated delivery dates."
        }
      ]
    },
    {
      category: "Inventory Management",
      questions: [
        {
          q: "Can I edit product information after adding it?",
          a: "Yes! In the Inventory page, you can click on any product row and edit the stock and price fields directly. Changes are saved automatically when you click outside the field."
        },
        {
          q: "How do I set up pricing tiers?",
          a: "When adding a product, you can specify multiple pricing tiers based on quantity. The system will automatically apply the best price tier based on the buyer's order quantity."
        },
        {
          q: "What happens when a product goes out of stock?",
          a: "The system automatically updates the status badge to 'Out of Stock' when stock reaches zero. You can manually update stock levels at any time."
        }
      ]
    },
    {
      category: "Orders & Shipments",
      questions: [
        {
          q: "How do I track shipments?",
          a: "Go to the Shipments page to see all orders in transit. You can add tracking numbers and carrier information when updating order status."
        },
        {
          q: "What payment methods are accepted?",
          a: "TradeFlow supports various payment methods. Payment details are handled securely through our platform. Contact support for specific payment options."
        },
        {
          q: "How do I generate invoices?",
          a: "In the Sales Orders page, each order has a 'Download Invoice' button. Click it to generate and download a PDF invoice for that order."
        }
      ]
    },
    {
      category: "Account & Settings",
      questions: [
        {
          q: "How do I update my profile information?",
          a: "Navigate to Settings from the sidebar. You can update your name, email, and company name in the Profile Information section."
        },
        {
          q: "How do I change my password?",
          a: "In the Settings page, use the Change Password section. Enter your current password and your new password twice to confirm."
        },
        {
          q: "Can I change my company name?",
          a: "Yes, you can update your company name in the Settings page under Profile Information. Changes take effect immediately."
        }
      ]
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Help Center</h2>
        <p className="text-slate-500 font-medium">Find answers to common questions and get support.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for help..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/vendor/settings")}
          className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all group text-left w-full"
        >
          <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-all">
            <Settings size={24} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 mb-1">Account Settings</h3>
            <p className="text-xs text-slate-500">Manage your profile</p>
          </div>
          <ChevronRight size={20} className="text-slate-400 group-hover:text-emerald-600" />
        </button>

        <button
          onClick={() => navigate("/vendor/inventory")}
          className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all group text-left w-full"
        >
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-all">
            <Book size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 mb-1">Inventory Guide</h3>
            <p className="text-xs text-slate-500">Learn about products</p>
          </div>
          <ChevronRight size={20} className="text-slate-400 group-hover:text-emerald-600" />
        </button>

        <button
          onClick={() => navigate("/vendor/quotes")}
          className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all group text-left w-full"
        >
          <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-all">
            <MessageSquare size={24} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 mb-1">Quote Help</h3>
            <p className="text-xs text-slate-500">RFQ management</p>
          </div>
          <ChevronRight size={20} className="text-slate-400 group-hover:text-emerald-600" />
        </button>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {filteredFAQs.map((category, catIdx) => (
          <div key={catIdx} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <FileText size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{category.category}</h3>
            </div>

            <div className="space-y-4">
              {category.questions.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <h4 className="font-black text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <HelpCircle size={48} className="mb-4 opacity-20" />
          <p className="font-black uppercase text-sm tracking-tighter">No results found</p>
          <p className="text-xs mt-2">Try a different search term</p>
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black mb-2 uppercase">Still Need Help?</h3>
            <p className="text-emerald-100 mb-6">Our support team is here to assist you.</p>
            <button className="px-6 py-3 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-50 transition-all">
              Contact Support
            </button>
          </div>
          <MessageSquare size={48} className="opacity-20" />
        </div>
      </div>
    </div>
  );
}
