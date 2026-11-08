import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Area from "./pages/Area";
import CreateRequest from "./pages/CreateRequest";
import MyRequests from "./pages/MyRequests";
import RequestsByArea from "./pages/RequestsByArea";

import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";

import "./styles/layout.css";
import "./styles/auth.css";
import "./styles/dashboard.css";

// Redirección según el área del usuario
function RoleRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p role="status">Comprobando sesión…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isGescom =
    user.role?.trim().toUpperCase() === "GESCOM";

  return (
    <Navigate
      to={isGescom ? "/gescom" : "/area"}
      replace
    />
  );
}

// Protección de rutas por rol
function RoleRoute({ children, gescomOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p role="status">Comprobando sesión…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isGescom =
    user.role?.trim().toUpperCase() === "GESCOM";

  if (gescomOnly && !isGescom) {
    return <Navigate to="/area" replace />;
  }

  if (!gescomOnly && isGescom) {
    return <Navigate to="/gescom" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Autenticación */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Redirección por rol */}
          <Route
            path="/panel"
            element={<RoleRedirect />}
          />

          {/* Panel GESCOM */}
          <Route
            path="/gescom"
            element={
              <RoleRoute gescomOnly>
                <Admin />
              </RoleRoute>
            }
          />

          {/* Panel de otras áreas */}
          <Route
            path="/area"
            element={
              <RoleRoute>
                <Area />
              </RoleRoute>
            }
          />

          {/* Publicar solicitud */}
          <Route
            path="/nuevo"
            element={
              <RoleRoute gescomOnly>
                <CreateRequest />
              </RoleRoute>
            }
          />

          {/* Gestionar solicitudes */}
          <Route
            path="/requerimientos"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* Solicitudes agrupadas por área */}
          <Route
            path="/por-area"
            element={
              <RoleRoute gescomOnly>
                <RequestsByArea />
              </RoleRoute>
            }
          />

          {/* Mapa */}
          <Route
            path="/mapa"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />

          {/* Mi cuenta */}
          <Route
            path="/cuenta"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Página original */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Ruta desconocida */}
          <Route
            path="*"
            element={<Navigate to="/panel" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;