import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Hook para acceder al contexto de autenticación

export default function useAuth() {
  return useContext(AuthContext);
}