import useAuth from "../hooks/useAuth";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

export default function Area() {
  const { user } = useAuth();

  return (
    <div className="home-page">

      <Navbar />

      <main className="dashboard-content">

        {/* Bienvenida */}
        <section className="dashboard-welcome">

          <span className="dashboard-label">
            PANEL DE ÁREA MUNICIPAL
          </span>

          <h1>Inicio — {user?.role}</h1>

          <p>
            Bienvenida, {user?.name || "funcionario"}.
          </p>

        </section>

        {/* Resumen de solicitudes */}
        <section className="dashboard-section">

          <h2>Resumen de solicitudes</h2>

          <div className="dashboard-stats">

            {/* Solicitudes asignadas */}
            <article className="stat-card">

              <span className="stat-title">
                Solicitudes asignadas
              </span>

              <strong>—</strong>

              <p>
                Solicitudes correspondientes a tu área.
              </p>

            </article>

            {/* Solicitudes pendientes */}
            <article className="stat-card">

              <span className="stat-title">
                Pendientes
              </span>

              <strong>—</strong>

              <p>
                Solicitudes que requieren atención.
              </p>

            </article>

            {/* Solicitudes resueltas */}
            <article className="stat-card">

              <span className="stat-title">
                Resueltas
              </span>

              <strong>—</strong>

              <p>
                Solicitudes cuya gestión ha finalizado.
              </p>

            </article>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}