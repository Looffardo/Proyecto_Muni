import { useState } from "react";

import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

import "../styles/create-request.css";

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
];

const TIPOS = [
  "Alumbrado Público",
  "Vereda",
  "Poda / Tala",
  "Infraestructura",
  "Seguridad",
  "Espacios Públicos",
  "Otro",
];

const FUENTES = [
  "Terreno",
  "Red social",
  "Reunión",
  "Solicitud Concejal",
  "Correo",
  "Otro",
];

export default function CreateRequest() {
  const [form, setForm] = useState({
    description: "",
    type: "",
    location: "",
    area: "",
    mayorCommitment: false,
    priority: "",
    manager: "",
    organization: "",
    macroSector: "",
    source: "",
  });

  const [photo, setPhoto] = useState(null);

  const today = new Date().toLocaleDateString("es-CL");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    setPhoto(file || null);
  }

  function handleClear() {
    setForm({
      description: "",
      type: "",
      location: "",
      area: "",
      mayorCommitment: false,
      priority: "",
      manager: "",
      organization: "",
      macroSector: "",
      source: "",
    });

    setPhoto(null);

    const photoInput =
      document.getElementById("request-photo");

    if (photoInput) {
      photoInput.value = "";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Pendiente:
    // Enviar los datos al backend cuando esté disponible.
  }

  return (
    <div className="home-page">

      <Navbar />

      <main className="dashboard-content">

        {/* Título */}
        <header className="create-request-header">

          <span className="dashboard-label">
            GESCOM
          </span>

          <h1>Publicar solicitud</h1>

        </header>

        <section className="request-form-card">

          <form onSubmit={handleSubmit}>

            {/* =====================================
                1. IDENTIFICACIÓN Y DESCRIPCIÓN
            ===================================== */}

            <h2>1. Identificación y descripción</h2>

            <div className="request-field">

              <label>
                Fecha de registro
              </label>

              <input
                type="text"
                value={today}
                readOnly
              />

            </div>

            <div className="request-field">

              <label>
                ID de solicitud
              </label>

              <input
                type="text"
                value="Se asignará al registrar la solicitud"
                readOnly
              />

            </div>

            <div className="request-field">

              <label htmlFor="request-description">
                Producto / Solicitud
              </label>

              <textarea
                id="request-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe detalladamente la solicitud o acción que debe realizarse..."
                rows={5}
                required
              />

            </div>

            <div className="request-field">

              <label htmlFor="request-type">
                Tipo de solicitud
              </label>

              <select
                id="request-type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona un tipo
                </option>

                {TIPOS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}

              </select>

            </div>

            <div className="request-field">

              <label htmlFor="request-location">
                Ubicación
              </label>

              <input
                id="request-location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej.: Calle 403 con 402, Peñalolén"
                required
              />

            </div>

            <div className="request-field">

              <label htmlFor="request-area">
                Dirección responsable
              </label>

              <select
                id="request-area"
                name="area"
                value={form.area}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona un área municipal
                </option>

                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}

              </select>

            </div>

            <div className="request-field">

              <label htmlFor="request-mayor">
                Compromiso del alcalde
              </label>

              <label className="request-checkbox-label">

                <input
                  id="request-mayor"
                  type="checkbox"
                  name="mayorCommitment"
                  checked={form.mayorCommitment}
                  onChange={handleChange}
                />

                <span>
                  Esta solicitud corresponde a un compromiso
                  directo del alcalde o su gabinete.
                </span>

              </label>

            </div>

            <div className="request-field">

              <label htmlFor="request-priority">
                Prioridad
              </label>

              <select
                id="request-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona una prioridad
                </option>

                <option value="0">
                  0 - Baja / Informativa
                </option>

                <option value="1">
                  1 - Baja
                </option>

                <option value="2">
                  2 - Media
                </option>

                <option value="3">
                  3 - Máxima urgencia / Legal
                </option>

              </select>

            </div>

            <div className="request-field">

              <label htmlFor="request-manager">
                Gestor responsable
              </label>

              <input
                id="request-manager"
                type="text"
                name="manager"
                value={form.manager}
                onChange={handleChange}
                placeholder="Nombre del funcionario responsable del seguimiento"
              />

            </div>

            {/* =====================================
                2. ORIGEN DE LA SOLICITUD
            ===================================== */}

            <h2>2. Origen de la solicitud</h2>

            <div className="request-field">

              <label htmlFor="request-organization">
                Organización o persona comprometida
              </label>

              <input
                id="request-organization"
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                placeholder="Nombre de la organización o persona"
              />

            </div>

            <div className="request-field">

              <label htmlFor="request-sector">
                Macrosector
              </label>

              <input
                id="request-sector"
                type="text"
                name="macroSector"
                value={form.macroSector}
                onChange={handleChange}
                placeholder="Ej.: Peñalolén Nuevo, San Luis"
              />

            </div>

            <div className="request-field">

              <label htmlFor="request-source">
                Fuente
              </label>

              <select
                id="request-source"
                name="source"
                value={form.source}
                onChange={handleChange}
              >
                <option value="">
                  Selecciona el origen
                </option>

                {FUENTES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}

              </select>

            </div>

            {/* =====================================
                3. DOCUMENTACIÓN
            ===================================== */}

            <h2>3. Documentación</h2>

            <div className="request-field">

              <label htmlFor="request-photo">
                Fotografía de la solicitud
              </label>

              <div className="request-photo-upload">

                <input
                  id="request-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />

                {photo && (
                  <p className="request-photo-name">
                    Archivo seleccionado: {photo.name}
                  </p>
                )}

              </div>

            </div>

            {/* =====================================
                ACCIONES
            ===================================== */}

            <div className="request-form-actions">

              <button
                type="button"
                className="request-clear-button"
                onClick={handleClear}
              >
                Limpiar formulario
              </button>

              <button
                type="submit"
                className="request-submit-button"
                disabled
                title="Disponible al conectar el backend"
              >
                Publicar solicitud
              </button>

            </div>

            <p className="request-form-note">
              La publicación estará disponible cuando
              el formulario se conecte con el backend.
            </p>

          </form>

        </section>

      </main>

      <Footer />

    </div>
  );
}