import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import BuyerAuth from "./pages/BuyerAuth";
import VendorAuth from "./pages/VendorAuth";
import AdminAuth from "./pages/AdminAuth";

// Landing & General Pages
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import BuyerRFQs from "./pages/BuyerRFQs";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerProfile from "./pages/BuyerProfile";
import BuyerSettings from "./pages/BuyerSettings";
import BuyerHelpCenter from "./pages/BuyerHelpCenter";
import BuyerNotifications from "./pages/BuyerNotifications";

// Vendor Pages
import VendorDashboard from "./pages/VendorDashboard";
import VendorInventory from "./pages/VendorInventory";
import VendorQuotes from "./pages/VendorQuotes";
import VendorOrders from "./pages/VendorOrders";
import VendorNotifications from "./pages/VendorNotifications";
import VendorShipments from "./pages/VendorShipments";
import VendorSettings from "./pages/VendorSettings";
import VendorProfile from "./pages/VendorProfile";
import VendorHelpCenter from "./pages/VendorHelpCenter";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminVendors from "./pages/AdminVendors";
import AdminBuyers from "./pages/AdminBuyers";
import AdminSettings from "./pages/AdminSettings";

// Layouts
import Layout from "./components/layout/Layout";
import VendorLayout from "./components/layout/VendorLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public & Auth Routes */}
        <Route path="/" element={<Landing />} />

        {/* Separate Login Paths */}
        <Route path="/buyer/login" element={<BuyerAuth />} />
        <Route path="/vendor/login" element={<VendorAuth />} />
        <Route path="/admin/login" element={<AdminAuth />} />

        {/* 2. Buyer/Public Section (Shared Layout) - Admins can also access */}
        <Route element={<Layout />}>
          <Route path="/market" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/buyer/rfqs" element={<BuyerRFQs />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
          <Route path="/buyer/settings" element={<BuyerSettings />} />
          <Route path="/buyer/help" element={<BuyerHelpCenter />} />
          <Route path="/buyer/notifications" element={<BuyerNotifications />} />
        </Route>

        {/* 3. Vendor Section (Emerald Theme) - Protected (Admins can also access) */}
        <Route
          element={
            <ProtectedRoute requiredRole="vendor" allowAdmin={true}>
              <VendorLayout theme="emerald" />
            </ProtectedRoute>
          }
        >
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/inventory" element={<VendorInventory />} />
          <Route path="/vendor/quotes" element={<VendorQuotes />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/shipments" element={<VendorShipments />} />
          <Route path="/vendor/notifications" element={<VendorNotifications />} />
          <Route path="/vendor/settings" element={<VendorSettings />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
          <Route path="/vendor/help" element={<VendorHelpCenter />} />
        </Route>

        {/* 4. Admin Section (Indigo Theme) - Protected */}
        <Route
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/buyers" element={<AdminBuyers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* 5. Catch-all / Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}