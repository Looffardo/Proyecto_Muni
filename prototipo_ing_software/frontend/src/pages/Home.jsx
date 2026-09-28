import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <h1>Bienvenido</h1>

        <p>
          Visualiza y registra requerimientos territoriales de Peñalolén.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default Home;