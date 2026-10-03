import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Solicitudes Barriales</h2>
      </div>

      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/mapa">Mapa</Link>
        <Link to="/requerimientos">Mis requerimientos</Link>
        <Link to="/nuevo">Reportar problema</Link>
      </div>

      <div className="navbar-user">
        {loading ? (
          <span>Comprobando sesión…</span>
        ) : user ? (
          <>
            <Link to="/cuenta">Mi cuenta</Link>

            <button onClick={handleLogout} disabled={busy}>
              {busy ? "Saliendo…" : "Cerrar sesión"}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </>
        )}

        {error && <p role="alert">{error}</p>}
      </div>
    </nav>
  );
}

export default Navbar;