import useAuth from "../hooks/useAuth";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

export default function Account() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <section className="auth-card">
          <h1>Mi cuenta</h1>
          <p>Bienvenido, {user.name}.</p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
          <p>Tu sesión está iniciada.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}