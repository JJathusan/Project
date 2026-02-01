import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Save, User, Building2, Mail, Lock, Loader2, CheckCircle, 
  Upload, Landmark, FileText, Image as ImageIcon, MapPin,
  Briefcase, Globe, Percent, Phone, Clock
} from "lucide-react";

export default function VendorSettings() {
  const fileInputRef = useRef(null);
  const licenseInputRef = useRef(null);
  
  // 1. Unified State for User Account and Vendor Profile
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    companyName: ""
  });

  const [vendorProfile, setVendorProfile] = useState({
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Files and Previews
  const [files, setFiles] = useState({ logo: null, license: null });
  const [previews, setPreviews] = useState({ logo: "", license: "" });

  // Loading & Feedback States
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchFullData();
  }, []);

  const fetchFullData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [authRes, profileRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/profile", { headers }),
        axios.get("http://localhost:5000/api/vendors/profile", { headers })
      ]);
      
      setUserData({
        name: authRes.data.name || "",
        email: authRes.data.email || "",
        companyName: authRes.data.companyName || ""
      });

      if (profileRes.data) {
        setVendorProfile({
          ...profileRes.data,
          bankDetails: profileRes.data.bankDetails || vendorProfile.bankDetails
        });
        
        if (profileRes.data.logo) {
          setPreviews(prev => ({ ...prev, logo: `http://localhost:5000${profileRes.data.logo}` }));
        }
        if (profileRes.data.businessLicenseUrl) {
          setPreviews(prev => ({ ...prev, license: `http://localhost:5000${profileRes.data.businessLicenseUrl}` }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch full data:", err);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Update Auth Account Data
      await axios.patch("http://localhost:5000/api/auth/profile", userData, { headers });

      // 2. Update Vendor Business Profile
      const formData = new FormData();
      Object.keys(vendorProfile).forEach(key => {
        if (key === "bankDetails") {
          formData.append(key, JSON.stringify(vendorProfile[key]));
        } else if (key !== "_id" && key !== "user" && key !== "__v" && key !== "logo" && key !== "businessLicenseUrl") {
          formData.append(key, vendorProfile[key] === null ? "" : vendorProfile[key]);
        }
      });

      formData.set("companyName", userData.companyName); // Sync company name
      if (files.logo) formData.append("logo", files.logo);
      if (files.license) formData.append("businessLicense", files.license);

      await axios.post("http://localhost:5000/api/vendors/setup", formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" }
      });

      localStorage.setItem("userName", userData.name);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch("http://localhost:5000/api/auth/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, { headers: { Authorization: `Bearer ${token}` } });

      setPasswordSaved(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Vendor Settings</h2>
          <p className="text-slate-500 font-medium">Manage your global trade identity and security</p>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Business Identity */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
              <Building2 size={22} className="text-emerald-600" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Company Identity</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 mb-4">
                <div className="w-24 h-24 bg-white rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {previews.logo ? (
                    <img src={previews.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-slate-300" size={32} />
                  )}
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Company Logo</h4>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileChange(e, "logo")} />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs hover:bg-emerald-50 transition-all">
                    <Upload size={14} /> Update Logo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Legal Company Name</label>
                <input type="text" value={userData.companyName || ""} onChange={(e) => setUserData({...userData, companyName: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Reg Number</label>
                <input type="text" value={vendorProfile.businessRegNumber || ""} onChange={(e) => setVendorProfile({...vendorProfile, businessRegNumber: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Industry</label>
                <select value={vendorProfile.industry || ""} onChange={(e) => setVendorProfile({...vendorProfile, industry: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold">
                   <option value="">Select Industry</option>
                   <option value="Electronics">Electronics</option>
                   <option value="Textiles">Textiles</option>
                   <option value="Chemicals">Chemicals</option>
                   <option value="Food/Agri">Agriculture</option>
                   <option value="Construction">Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Years in Business</label>
                <input type="number" value={vendorProfile.yearsInBusiness || ""} onChange={(e) => setVendorProfile({...vendorProfile, yearsInBusiness: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Company Size (Staff)</label>
                <input type="text" placeholder="e.g. 10-50" value={vendorProfile.companySize || ""} onChange={(e) => setVendorProfile({...vendorProfile, companySize: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Response Time</label>
                <select value={vendorProfile.responseTime || "Within 24 hours"} onChange={(e) => setVendorProfile({...vendorProfile, responseTime: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold">
                   <option value="Within 1 hour">Within 1 hour</option>
                   <option value="Within 6 hours">Within 6 hours</option>
                   <option value="Within 24 hours">Within 24 hours</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Business Description</label>
                <textarea rows="3" value={vendorProfile.description || ""} onChange={(e) => setVendorProfile({...vendorProfile, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Location */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
              <MapPin size={22} className="text-emerald-600" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Contact & Location</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Contact Person</label>
                <input type="text" value={vendorProfile.contactPerson || ""} onChange={(e) => setVendorProfile({...vendorProfile, contactPerson: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Country</label>
                <input type="text" value={vendorProfile.country || ""} onChange={(e) => setVendorProfile({...vendorProfile, country: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Phone Number</label>
                <input type="text" value={vendorProfile.phone || ""} onChange={(e) => setVendorProfile({...vendorProfile, phone: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Registered Office Address</label>
                <input type="text" value={vendorProfile.officeAddress || ""} onChange={(e) => setVendorProfile({...vendorProfile, officeAddress: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
            </div>
          </div>

          {/* Section 3: Legal & Financials */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
              <Landmark size={22} className="text-emerald-600" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Legal & Financials</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Tax ID / TIN</label>
                <input type="text" value={vendorProfile.taxId || ""} onChange={(e) => setVendorProfile({...vendorProfile, taxId: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Business License</label>
                <div onClick={() => licenseInputRef.current.click()} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all">
                  <span className="text-[10px] font-black text-slate-400 truncate uppercase">
                    {files.license ? files.license.name : (vendorProfile.businessLicenseUrl ? "View Existing" : "Update License")}
                  </span>
                  <FileText size={18} className="text-slate-400" />
                </div>
                <input type="file" className="hidden" ref={licenseInputRef} onChange={(e) => handleFileChange(e, "license")} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Bank Name</label>
                <input type="text" value={vendorProfile.bankDetails.bankName || ""} onChange={(e) => setVendorProfile({...vendorProfile, bankDetails: {...vendorProfile.bankDetails, bankName: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Account Number</label>
                <input type="text" value={vendorProfile.bankDetails.accountNumber || ""} onChange={(e) => setVendorProfile({...vendorProfile, bankDetails: {...vendorProfile.bankDetails, accountNumber: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">Account Name</label>
                <input type="text" value={vendorProfile.bankDetails.accountName || ""} onChange={(e) => setVendorProfile({...vendorProfile, bankDetails: {...vendorProfile.bankDetails, accountName: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest pl-1">SWIFT Code</label>
                <input type="text" value={vendorProfile.bankDetails.swiftCode || ""} onChange={(e) => setVendorProfile({...vendorProfile, bankDetails: {...vendorProfile.bankDetails, swiftCode: e.target.value}})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Security */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
              <Save size={20} className="text-emerald-400" /> Save Profile
            </h3>
            <p className="text-slate-400 text-xs font-bold mb-6 italic">Ensure all trade information is accurate for compliance.</p>
            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : (saved ? "Saved" : "Apply Updates")}
            </button>
            {error && <p className="text-red-400 text-[10px] font-black mt-4 uppercase tracking-widest">{error}</p>}
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" /> Password
            </h3>
            <div className="space-y-4">
              <input type="password" placeholder="Current Password" value={passwordData.currentPassword || ""} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              <input type="password" placeholder="New Password" value={passwordData.newPassword || ""} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              <input type="password" placeholder="Confirm New" value={passwordData.confirmPassword || ""} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              <button type="button" onClick={handlePasswordUpdate} disabled={passwordLoading} className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                {passwordLoading ? "Wait..." : "Change Password"}
              </button>
              {passwordSaved && <p className="text-emerald-600 text-center text-[10px] font-black uppercase tracking-widest">Success!</p>}
              {passwordError && <p className="text-red-600 text-center text-[10px] font-black uppercase tracking-widest">{passwordError}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}