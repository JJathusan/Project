import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole = null, allowAdmin = false }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If allowAdmin is true, admins can access this route
  if (requiredRole && userRole !== requiredRole) {
    if (allowAdmin && userRole === "admin") {
      // Admin is allowed to access this route
      return children;
    }
    
    // Redirect based on role
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === "vendor") {
      return <Navigate to="/vendor/dashboard" replace />;
    } else {
      return <Navigate to="/market" replace />;
    }
  }

  return children;
}
