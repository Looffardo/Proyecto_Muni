import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

export default function Admin() {
  const { user } = useAuth();

  return (
    <div className="home-page">

      <Navbar />

      <main className="dashboard-content">

        {/* Bienvenida */}
        <section className="dashboard-welcome">

          <span className="dashboard-label">
            PANEL ADMINISTRATIVO
          </span>

          <h1>Inicio — GESCOM</h1>

          <p>
            Bienvenida, {user?.name || "funcionario"}.
          </p>

        </section>

        {/* Resumen de solicitudes */}
        <section className="dashboard-section">

          <h2>Resumen de solicitudes</h2>

          <div className="dashboard-stats">

            <article className="stat-card">

              <span className="stat-title">
                Solicitudes totales
              </span>

              <strong>—</strong>

              <p>
                Solicitudes registradas en la plataforma.
              </p>

            </article>

            <article className="stat-card">

              <span className="stat-title">
                Solicitudes pendientes
              </span>

              <strong>—</strong>

              <p>
                Solicitudes que requieren gestión.
              </p>

            </article>

            <article className="stat-card">

              <span className="stat-title">
                Solicitudes resueltas
              </span>

              <strong>—</strong>

              <p>
                Solicitudes cuya gestión ha finalizado.
              </p>

            </article>

          </div>

        </section>

        {/* Publicación de solicitudes */}
        <section className="dashboard-section">

          <h2>Publicación de solicitudes</h2>

          <div className="dashboard-actions dashboard-actions-single">

            <article className="action-card">

              <div className="action-icon">
                +
              </div>

              <h3>Publicar solicitud</h3>

              <p>
                Registra una nueva solicitud barrial,
                incluyendo su descripción, categoría
                y ubicación.
              </p>

              <Link
                to="/nuevo"
                className="dashboard-button"
              >
                Publicar solicitud
              </Link>

            </article>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}