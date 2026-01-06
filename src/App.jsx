import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import VendorDashboard from "./pages/VendorDashboard";
import VendorInventory from "./pages/VendorInventory";

// Layouts
import Layout from "./components/layout/Layout";
import VendorLayout from "./components/layout/VendorLayout";
import VendorQuotes from "./pages/VendorQuotes";
import VendorOrders from "./pages/VendorOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Buyer Section */}
        <Route element={<Layout />}>
          <Route path="/market" element={<Marketplace />} />
          <Route path="/market/:id" element={<ProductDetail />} />
        </Route>

        {/* Vendor Section */}
        <Route element={<VendorLayout theme="emerald" />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
<Route path="/vendor/inventory" element={<VendorInventory />} />
<Route path="/vendor/quotes" element={<VendorQuotes />} />
<Route path="/vendor/orders" element={<VendorOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}