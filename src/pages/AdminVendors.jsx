import React from "react";
import { useNavigate } from "react-router-dom";
import AdminUsers from "./AdminUsers";

export default function AdminVendors() {
  const navigate = useNavigate();
  
  // This component will be a wrapper that shows only vendors
  // We'll modify AdminUsers to accept a default filter prop
  return <AdminUsers defaultFilter="vendor" />;
}
