import { createContext, useEffect, useState } from "react";
import { authRequest } from "../api/authApi";

export const AuthContext = createContext(null);

// Proveedor de contexto para la autenticación de usuarios

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    authRequest("me")
      .then((data) => setUser(data.user))
      .catch((error) => {
        if (error.status !== 401) {
          setSessionError(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(mode, fields) {
    const data = await authRequest(mode, fields);

    setUser(data.user);
    setSessionError("");
  }

  async function logout() {
    await authRequest("logout", {});
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionError,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}