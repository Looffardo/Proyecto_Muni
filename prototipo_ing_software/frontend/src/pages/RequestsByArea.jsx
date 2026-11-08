import { Link } from "react-router-dom";

import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

const AREAS = [
  "Tránsito",
  "Espacios Públicos",
  "Inspección",
  "Seguridad Humana",
  "Deportes",
  "DIDECO",
  "Jurídico",
  "DOM",
  "SECPLA",
  "Delegación Peñalolén Alto",
  "GESCOM",
];

export default function RequestsByArea() {
  return (
    <div className="home-page">

      <Navbar />

      <main className="dashboard-content">

        {/* Encabezado */}
        <section className="dashboard-welcome">

          <span className="dashboard-label">
            GESTIÓN MUNICIPAL
          </span>

          <h1>Solicitudes por área</h1>

          <p>
            Consulta las solicitudes barriales
            organizadas por departamento municipal.
          </p>

        </section>

        {/* Áreas municipales */}
        <section className="dashboard-section">

          <h2>Áreas municipales</h2>

          <div className="areas-grid">

            {AREAS.map((area) => (
              <article className="area-card" key={area}>

                <div className="action-icon">
                  ≡
                </div>

                <h3>{area}</h3>

                <p>
                  Consultar las solicitudes
                  correspondientes a esta área.
                </p>

                <Link
                  to={`/requerimientos?area=${encodeURIComponent(area)}`}
                  className="dashboard-button"
                >
                  Ver solicitudes
                </Link>

              </article>
            ))}

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}