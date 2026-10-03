import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import "./styles/layout.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import "./styles/auth.css";

// NOTA IMPORTANTE: El idioma de las rutas y componentes debe ser consistente

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/cuenta" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;