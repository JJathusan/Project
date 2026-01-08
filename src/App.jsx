import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import BuyerAuth from "./pages/BuyerAuth";
import VendorAuth from "./pages/VendorAuth";

// Landing & General Pages
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";

// Vendor Pages
import VendorDashboard from "./pages/VendorDashboard";
import VendorInventory from "./pages/VendorInventory";
import VendorQuotes from "./pages/VendorQuotes";
import VendorOrders from "./pages/VendorOrders";

// Layouts
import Layout from "./components/layout/Layout";
import VendorLayout from "./components/layout/VendorLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public & Auth Routes */}
        <Route path="/" element={<Landing />} />
        
        {/* Separate Login Paths */}
        <Route path="/buyer/login" element={<BuyerAuth />} />
        <Route path="/vendor/login" element={<VendorAuth />} />

        {/* 2. Buyer/Public Section (Shared Layout) */}
        <Route element={<Layout />}>
          <Route path="/market" element={<Marketplace />} />
          {/* Changed from /market/:id to /product/:id to match Card.jsx */}
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* 3. Vendor Section (Emerald Theme) */}
        <Route element={<VendorLayout theme="emerald" />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/inventory" element={<VendorInventory />} />
          <Route path="/vendor/quotes" element={<VendorQuotes />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
        </Route>

        {/* 4. Catch-all / Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}