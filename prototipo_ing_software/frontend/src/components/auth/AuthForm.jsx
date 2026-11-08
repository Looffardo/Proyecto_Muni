import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Footer from "../navigation/Footer";
import logoPenalolen from "../../assets/logos/logo-penalolen.png";

export default function AuthForm({ register = false }) {
  const { user, loading, authenticate, sessionError } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) {
    return <p role="status">Comprobando sesión…</p>;
  }

  // Si ya tiene sesión, dirigirlo a su panel
  if (user) {
    return <Navigate to="/panel" replace />;
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
      await authenticate(
        register ? "register" : "login",
        fields
      );

      // El panel identifica el área del usuario
      navigate("/panel", { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="home-page">

      <header className="login-header">

        <img
          src={logoPenalolen}
          alt="Municipalidad de Peñalolén"
          className="navbar-logo-img"
        />

        <h2>Solicitudes Barriales</h2>

      </header>

      <main className="home-content">

        <section className="auth-card">

          <h1>
            {register ? "Crear cuenta" : "Iniciar sesión"}
          </h1>

          <p>
            {register
              ? "Regístrate"
              : "Ingresa con tu correo y contraseña."}
          </p>

          {sessionError && (
            <p role="status">{sessionError}</p>
          )}

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
                    register
                      ? "new-password"
                      : "current-password"
                  }
                  minLength={register ? 8 : undefined}
                  maxLength={72}
                  required
                />
              </label>

              <label>
                Área municipal

                <select
                  name="role"
                  value={fields.role}
                  onChange={change}
                  required
                >
                  <option value="" disabled>
                    Selecciona tu área
                  </option>

                  <option value="Tránsito">
                    Tránsito
                  </option>

                  <option value="Espacios Públicos">
                    Espacios Públicos
                  </option>

                  <option value="Inspección">
                    Inspección
                  </option>

                  <option value="Seguridad Humana">
                    Seguridad Humana
                  </option>

                  <option value="Deportes">
                    Deportes
                  </option>

                  <option value="DIDECO">
                    DIDECO
                  </option>

                  <option value="Jurídico">
                    Jurídico
                  </option>

                  <option value="DOM">
                    DOM
                  </option>

                  <option value="SECPLA">
                    SECPLA
                  </option>

                  <option value="Delegación Peñalolén Alto">
                    Delegación Peñalolén Alto
                  </option>

                  <option value="GESCOM">
                    GESCOM
                  </option>
                </select>
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
                <p
                  className="auth-error"
                  role="alert"
                >
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
            {register
              ? "¿Ya tienes cuenta? "
              : "¿No tienes cuenta? "}

            <Link
              to={register ? "/login" : "/registro"}
            >
              {register
                ? "Inicia sesión"
                : "Regístrate"}
            </Link>
          </p>

        </section>

      </main>

      <Footer />

    </div>
  );
}