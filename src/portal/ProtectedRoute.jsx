import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getRole } from "./auth";

export default function ProtectedRoute({ allowRole, children }) {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to={allowRole === "admin" ? "/admin/login" : "/portal/login"} replace />;
  }

  if (allowRole && role !== allowRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}