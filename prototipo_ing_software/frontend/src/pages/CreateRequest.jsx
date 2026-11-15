import { useState } from "react";

import { createRequest } from "../api/requestsApi";
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
    title: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      title: "",
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

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.type || !form.location || !form.area || !form.priority) {
      setError("Completa los campos obligatorios antes de enviar la solicitud.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
        area: form.area,
        mayorCommitment: Boolean(form.mayorCommitment),
        priority: Number(form.priority),
        manager: form.manager,
        organization: form.organization,
        macroSector: form.macroSector,
        source: form.source,
        photoUrl: photo ? photo.name : "",
      };

      const response = await createRequest(payload);

      setSuccess(`Solicitud publicada correctamente. ID: ${response.request?.code ?? "generado"}`);
      handleClear();
    } catch (submitError) {
      setError(submitError.message || "No se pudo publicar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
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

              <label htmlFor="request-title">
                Título de la solicitud
              </label>

              <input
                id="request-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej.: Reparación de luminaria"
                maxLength={120}
                required
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
                placeholder="Ej.: Av. Diagonal Las Torres 2000, Peñalolén"
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

            {error && (
              <p className="request-form-error">{error}</p>
            )}

            {success && (
              <p className="request-form-success">{success}</p>
            )}

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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publicando..." : "Publicar solicitud"}
              </button>

            </div>

          </form>

        </section>

      </main>

      <Footer />

    </div>
  );
}