import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import logoPenalolen from "../../assets/logos/logo-penalolen.png";

import "../../styles/account-nav.css";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isGescom =
    user?.role?.trim().toUpperCase() === "GESCOM";

  const firstName =
    user?.name?.trim().split(/\s+/)[0] || "Mi cuenta";

  async function handleLogout() {
    setBusy(true);
    setError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <nav className="navbar">

      {/* Logo municipal */}
      <div className="navbar-brand">

        <img
          src={logoPenalolen}
          alt="Municipalidad de Peñalolén"
          className="navbar-logo-img"
        />

        <h2>Solicitudes Barriales</h2>

      </div>

      {/* Navegación principal */}
      <div className="navbar-links">

        <Link to="/panel">
          Inicio
        </Link>

        {isGescom && (
          <Link to="/nuevo">
            Publicar solicitud
          </Link>
        )}

        <Link to="/requerimientos">
          Gestionar solicitudes
        </Link>

        <Link to="/mapa">
          Mapa
        </Link>

      </div>

      {/* Cuenta y sesión */}
      <div className="navbar-user account-navigation">

        {loading ? (
          <span>Comprobando sesión…</span>

        ) : user ? (
          <>

            {/* Área del funcionario */}
            <span className="navbar-role">
              {user.role}
            </span>

            {/* Perfil */}
            <Link
              to="/cuenta"
              className="account-button"
              title="Ver mi cuenta"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>

              <span>{firstName}</span>
            </Link>

            {/* Cerrar sesión */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={busy}
              className="logout-button"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>

              <span>
                {busy ? "Saliendo…" : "Cerrar sesión"}
              </span>
            </button>

          </>

        ) : (
          <Link to="/login">
            Iniciar sesión
          </Link>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

      </div>

    </nav>
  );
}

export default Navbar;