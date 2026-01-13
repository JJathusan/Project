import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Edit2, Trash2, Search, Loader2, Mail, Building2, Shield, Plus, X } from "lucide-react";

export default function AdminUsers({ defaultFilter = "all" }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState(defaultFilter);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    companyName: ""
  });

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const endpoint = filterRole === "all" 
        ? "http://localhost:5000/api/admin/users"
        : `http://localhost:5000/api/admin/users/${filterRole}`;
      
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/admin/users", newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("User created successfully");
      setShowCreateModal(false);
      setNewUser({ name: "", email: "", password: "", role: "buyer", companyName: "" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to create user:", err);
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-600";
      case "vendor": return "bg-emerald-100 text-emerald-600";
      case "buyer": return "bg-blue-100 text-blue-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase text-xs tracking-widest">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {defaultFilter === "vendor" ? "Vendors" : defaultFilter === "buyer" ? "Buyers" : "All Users"}
          </h2>
          <p className="text-slate-500 font-medium">
            {defaultFilter === "vendor" ? "Manage all vendor accounts." : defaultFilter === "buyer" ? "Manage all buyer accounts." : "Manage all users in the system."}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="vendor">Vendors</option>
            <option value="buyer">Buyers</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">User</th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Email</th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Company</th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Role</th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <Users size={40} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm">
                          {user.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-black text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.companyName ? (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Building2 size={16} className="text-slate-400" />
                          <span className="text-sm font-medium">{user.companyName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase">Create New User</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUser({ name: "", email: "", password: "", role: "buyer", companyName: "" });
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Role *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                >
                  <option value="buyer">Buyer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newUser.companyName}
                  onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                  placeholder="Enter company name (optional)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUser({ name: "", email: "", password: "", role: "buyer", companyName: "" });
                }}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function handleEdit(user) {
    const newName = prompt("Enter new name:", user.name);
    if (!newName || newName === user.name) return;

    const newEmail = prompt("Enter new email:", user.email);
    if (!newEmail) return;

    const newCompanyName = prompt("Enter new company name:", user.companyName || "");
    
    const token = localStorage.getItem("token");
    axios.patch(
      `http://localhost:5000/api/admin/users/${user._id}`,
      { name: newName, email: newEmail, companyName: newCompanyName },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        alert("User updated successfully");
        fetchUsers();
      })
      .catch((err) => {
        console.error("Failed to update user:", err);
        alert(err.response?.data?.message || "Failed to update user");
      });
  }
}
