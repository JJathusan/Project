import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole = null, allowAdmin = false }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const isProfileSetup = localStorage.getItem("isProfileSetup") === "true"; // Check profile status
  const location = useLocation();

  // 1. If not logged in, go to landing/login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Vendor Profile Setup Check
  // If user is a vendor, has NOT setup profile, and is NOT already on the setup page
  if (userRole === "vendor" && !isProfileSetup && location.pathname !== "/vendor-setup") {
    return <Navigate to="/vendor-setup" replace />;
  }

  // 3. Role Authorization
  if (requiredRole && userRole !== requiredRole) {
    if (allowAdmin && userRole === "admin") {
      return children;
    }
    
    // Redirect based on role if they try to access a page they don't belong in
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "vendor") {
      // If profile is setup, go to dashboard, else setup
      return <Navigate to={isProfileSetup ? "/vendor/dashboard" : "/vendor-setup"} replace />;
    } else {
      return <Navigate to="/market" replace />;
    }
  }

  return children;
}