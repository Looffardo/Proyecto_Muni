import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import MapView from "../components/map/MapView";

function MapPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <h1>Mapa de requerimientos</h1>
        <p>
          Visualiza los requerimientos registrados en la comuna de Peñalolén.
        </p>

        <MapView />
      </main>

      <Footer />
    </div>
  );
}

export default MapPage;