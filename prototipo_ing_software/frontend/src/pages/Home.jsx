import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <section className="home-intro">
          <h1>Solicitudes Barriales de Peñalolén</h1>

          <p>
            Reporta problemáticas de tu barrio, visualízalas en el mapa y
            realiza seguimiento de su estado.
          </p>
        </section>

        <section className="how-it-works">
          <h2>¿Cómo funciona?</h2>

          <div className="steps-container">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Reporta</h3>
              <p>
                Registra una problemática indicando su tipo, descripción,
                fotografía y ubicación.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">2</span>
              <h3>Ubica</h3>
              <p>
                Selecciona en el mapa el lugar exacto donde se encuentra el
                problema.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Haz seguimiento</h3>
              <p>
                Consulta el requerimiento y revisa su estado a medida que
                avanza su gestión.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;