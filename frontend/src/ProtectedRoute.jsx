import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Si no está logueado → redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si tiene rol pero no está en la lista de permitidos → redirigir a no autorizado
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // Si todo está bien, renderiza la página protegida
  return <>{children}</>;
}