import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";

// Componente de formulario de autenticación para registro e inicio de sesión

export default function AuthForm({ register = false }) {
  const { user, loading, authenticate, sessionError } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) {
    return <p role="status">Comprobando sesión…</p>;
  }

  if (user) {
    return <Navigate to="/cuenta" replace />;
  }

  function change(event) {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (register && fields.password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setBusy(true);

    try {
      await authenticate(register ? "register" : "login", fields);
      navigate("/cuenta", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <section className="auth-card">
          <h1>{register ? "Crear cuenta" : "Iniciar sesión"}</h1>

          <p>
            {register
              ? "Regístrate como vecino de Peñalolén."
              : "Ingresa con tu correo y contraseña."}
          </p>

          {sessionError && <p role="status">{sessionError}</p>}

          <form onSubmit={submit}>
            <fieldset disabled={busy}>
              {register && (
                <label>
                  Nombre
                  <input
                    name="name"
                    value={fields.name}
                    onChange={change}
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </label>
              )}

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={change}
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  name="password"
                  value={fields.password}
                  onChange={change}
                  autoComplete={
                    register ? "new-password" : "current-password"
                  }
                  minLength={register ? 8 : undefined}
                  maxLength={72}
                  required
                />
              </label>

              {register && (
                <>
                  <small>
                    Mínimo 8 caracteres.
                  </small>

                  <label>
                    Repetir contraseña
                    <input
                      type="password"
                      value={confirmation}
                      onChange={(event) =>
                        setConfirmation(event.target.value)
                      }
                      autoComplete="new-password"
                      required
                    />
                  </label>
                </>
              )}

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit">
                {busy
                  ? "Espera…"
                  : register
                    ? "Crear cuenta"
                    : "Ingresar"}
              </button>
            </fieldset>
          </form>

          <p>
            {register ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
            <Link to={register ? "/login" : "/registro"}>
              {register ? "Inicia sesión" : "Regístrate"}
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}