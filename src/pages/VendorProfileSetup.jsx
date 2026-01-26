import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Building2, Landmark, Upload, CheckCircle, 
  ArrowRight, Loader2, MapPin, Image as ImageIcon,
  FileText, Briefcase, Globe, X, Percent
} from "lucide-react";

export default function VendorProfileSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const licenseInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Unified Form State with ALL missing fields from your DB object
  const [formData, setFormData] = useState({
    companyName: localStorage.getItem("tempCompanyName") || "",
    businessRegNumber: "",
    industry: "",
    description: "",
    yearsInBusiness: "",
    companySize: "",
    contactPerson: "",
    phone: "",
    officeAddress: "",
    country: "",
    taxId: "",
    responseTime: "Within 24 hours",
    fulfillmentRate: 100,
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      swiftCode: ""
    }
  });

  const [files, setFiles] = useState({ logo: null, license: null });
  const [previews, setPreviews] = useState({ logo: "", license: "" });

  // 2. LOAD EXISTING DATA (This prevents the "_id" and duplicate issues)
  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/vendors/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          // Fill form with existing data from DB
          setFormData({
            ...res.data,
            bankDetails: res.data.bankDetails || formData.bankDetails
          });
          // Set previews for existing images
          if (res.data.logo) setPreviews(p => ({ ...p, logo: `http://localhost:5000${res.data.logo}` }));
          if (res.data.businessLicenseUrl) setPreviews(p => ({ ...p, license: `http://localhost:5000${res.data.businessLicenseUrl}` }));
        }
      } catch (err) {
        console.log("No existing profile found, starting fresh.");
      } finally {
        setFetching(false);
      }
    };
    fetchExistingProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key === "bankDetails") {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key !== "_id" && key !== "user" && key !== "__v") {
        data.append(key, formData[key] === null ? "" : formData[key]);
      }
    });

    if (files.logo) data.append("logo", files.logo);
    if (files.license) data.append("businessLicense", files.license);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/vendors/setup", data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      localStorage.setItem("isProfileSetup", "true");
      localStorage.removeItem("tempCompanyName");

      alert("Profile Saved Successfully!");
      navigate("/vendor/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center font-black animate-pulse">LOADING PROFILE DATA...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Vendor Profile Setup</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 border-t border-slate-200 pt-2 inline-block">Official Trade Identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Identity */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <Building2 className="text-emerald-600" size={20} />
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Company Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {previews.logo ? (
                    <img src={previews.logo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-slate-300" size={32} />
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Logo</h4>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileChange(e, "logo")} />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-[10px] uppercase hover:bg-emerald-50 transition-all shadow-sm">
                    <Upload size={14} /> Choose Image
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Legal Company Name *</label>
                <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Business Reg #</label>
                <input name="businessRegNumber" value={formData.businessRegNumber} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold">
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Food/Agri">Agriculture</option>
                  <option value="Construction">Construction</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Years in Business</label>
                <input type="number" name="yearsInBusiness" value={formData.yearsInBusiness || ""} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Company Size (Staff)</label>
                <input name="companySize" placeholder="e.g. 50" value={formData.companySize} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Response Time</label>
                <input name="responseTime" value={formData.responseTime} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Business Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Geography */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <MapPin className="text-emerald-600" size={20} />
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Contact & Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Contact Person / Role</label>
                <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Country</label>
                <input name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Registered Office Address</label>
                <input name="officeAddress" value={formData.officeAddress} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
            </div>
          </div>

          {/* Section 3: Legal & Banking */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <Landmark className="text-emerald-600" size={20} />
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Legal & Financials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Tax ID (VAT/TIN)</label>
                <input name="taxId" value={formData.taxId} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Business License</label>
                <div 
                  onClick={() => licenseInputRef.current.click()}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
                >
                  <span className="text-[10px] font-black text-slate-400 truncate uppercase">
                    {files.license ? files.license.name : "Upload License File"}
                  </span>
                  <FileText size={18} className="text-slate-400" />
                </div>
                <input type="file" className="hidden" ref={licenseInputRef} onChange={(e) => handleFileChange(e, "license")} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Bank Name</label>
                <input name="bankDetails.bankName" value={formData.bankDetails.bankName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Account Name</label>
                <input name="bankDetails.accountName" value={formData.bankDetails.accountName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Account Number</label>
                <input name="bankDetails.accountNumber" value={formData.bankDetails.accountNumber} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">SWIFT / BIC Code</label>
                <input name="bankDetails.swiftCode" value={formData.bankDetails.swiftCode} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-emerald-600 font-bold" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Save Official Profile <CheckCircle size={18}/></>}
          </button>
        </form>
      </div>
    </div>
  );
}