import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p role="status">Comprobando sesión…</p>;
  }

  return user ? children : <Navigate to="/login" replace />;
}