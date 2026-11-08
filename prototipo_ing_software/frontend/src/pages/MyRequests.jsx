import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

import "../styles/manage-requests.css";
import "../styles/request-tracking.css";

const ESTADOS = [
  "No iniciado",
  "En diseño",
  "Terminado",
  "Infactible",
];

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

const PRIORIDADES = {
  0: "Informativa",
  1: "Baja",
  2: "Media",
  3: "Alta",
};

// Solicitudes ficticias para desarrollar el frontend.
const SOLICITUDES_INICIALES = [
  {
    id: "T-0001",
    title: "Reparación de luminaria",
    description: "Luminaria sin funcionamiento en sector residencial.",
    area: "Espacios Públicos",
    priority: 3,
    status: "Pendiente",
    location: "Peñalolén",
    date: "2026-11-01",
    cabinetStatus: "No iniciado",
    reportedStatus: "No iniciado",
    directionReport: "",
    directionComment: "",
    cabinetComment: "",
    managerComment: "",
    url: "",
    history: [],
  },
  {
    id: "T-0002",
    title: "Reparación de vereda",
    description: "Desnivel en vereda que dificulta el tránsito peatonal.",
    area: "DOM",
    priority: 2,
    status: "En proceso",
    location: "Peñalolén",
    date: "2026-11-02",
    cabinetStatus: "En diseño",
    reportedStatus: "No iniciado",
    directionReport: "",
    directionComment: "",
    cabinetComment: "",
    managerComment: "",
    url: "",
    history: [],
  },
  {
    id: "T-0003",
    title: "Señalización vial",
    description: "Reposición de señal de tránsito deteriorada.",
    area: "Tránsito",
    priority: 1,
    status: "Resuelta",
    location: "Peñalolén",
    date: "2026-11-03",
    cabinetStatus: "Terminado",
    reportedStatus: "Terminado",
    directionReport: "",
    directionComment: "",
    cabinetComment: "",
    managerComment: "",
    url: "",
    history: [],
  },
];

function TrackingField({
  label,
  name,
  value,
  onChange,
  disabled,
  placeholder,
}) {
  return (
    <div className="tracking-field">
      <label htmlFor={name}>{label}</label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}

function RequestDetail({
  request,
  isGescom,
  user,
  onSave,
}) {
  const [draft, setDraft] = useState({
    cabinetStatus: request.cabinetStatus,
    reportedStatus: request.reportedStatus,
    directionReport: request.directionReport,
    directionComment: request.directionComment,
    cabinetComment: request.cabinetComment,
    managerComment: request.managerComment,
    url: request.url,
  });

  const [savedMessage, setSavedMessage] = useState("");

  const canEditDirection =
    !isGescom && user?.role === request.area;

  const canEditCabinet = isGescom;

  // Permiso provisional para comentarios del gestor.
  const canEditManager = isGescom;

  const matchingStates =
    draft.cabinetStatus === draft.reportedStatus;

  function change(event) {
    const { name, value } = event.target;

    setDraft((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSavedMessage("");
  }

  function saveDemo() {
    onSave(request.id, draft, user?.name || "Funcionario");

    setSavedMessage(
      "Cambios aplicados en esta vista de prueba. No se guardaron en MongoDB."
    );
  }

  const canEdit =
    canEditDirection || canEditCabinet || canEditManager;

  return (
    <div className="request-expanded">

      {/* INFORMACIÓN GENERAL */}
      <section className="tracking-section">

        <h3>1. Información general</h3>

        <div className="request-details-grid">

          <div>
            <span>ID de solicitud</span>
            <strong>{request.id}</strong>
          </div>

          <div>
            <span>Área responsable</span>
            <strong>{request.area}</strong>
          </div>

          <div>
            <span>Prioridad</span>
            <strong>{PRIORIDADES[request.priority]}</strong>
          </div>

          <div>
            <span>Fecha de registro</span>
            <strong>{request.date}</strong>
          </div>

          <div>
            <span>Ubicación</span>
            <strong>{request.location}</strong>
          </div>

        </div>

        <div className="request-detail-description">
          <span>Descripción</span>
          <p>{request.description}</p>
        </div>

      </section>

      {/* ESTADOS */}
      <section className="tracking-section">

        <h3>2. Estado y seguimiento</h3>

        <div className="tracking-status-grid">

          <div className="tracking-field">

            <label htmlFor={`cabinet-${request.id}`}>
              Estado Gabinete
            </label>

            <select
              id={`cabinet-${request.id}`}
              name="cabinetStatus"
              value={draft.cabinetStatus}
              onChange={change}
              disabled={!canEditCabinet}
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

            <small>
              Actualizado por GESCOM.
            </small>

          </div>

          <div className="tracking-field">

            <label htmlFor={`reported-${request.id}`}>
              Estado Reportado
            </label>

            <select
              id={`reported-${request.id}`}
              name="reportedStatus"
              value={draft.reportedStatus}
              onChange={change}
              disabled={!canEditDirection}
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

            <small>
              Actualizado por el área responsable.
            </small>

          </div>

        </div>

        <div className="tracking-comparison">

          <span>¿Coinciden los estados?</span>

          <span
            className={
              matchingStates
                ? "tracking-match"
                : "tracking-mismatch"
            }
          >
            {matchingStates
              ? "Sí, coinciden"
              : "No coinciden"}
          </span>

        </div>

      </section>

      {/* COMENTARIOS */}
      <section className="tracking-section">

        <h3>3. Comentarios de seguimiento</h3>

        <div className="tracking-comments">

          <TrackingField
            label="Comentario reportado por la dirección"
            name="directionReport"
            value={draft.directionReport}
            onChange={change}
            disabled={!canEditDirection}
            placeholder="Justificación del estado reportado..."
          />

          <TrackingField
            label="Comentario de la dirección"
            name="directionComment"
            value={draft.directionComment}
            onChange={change}
            disabled={!canEditDirection}
            placeholder="Acciones realizadas por el área..."
          />

          <TrackingField
            label="Comentario del gabinete"
            name="cabinetComment"
            value={draft.cabinetComment}
            onChange={change}
            disabled={!canEditCabinet}
            placeholder="Observaciones internas de GESCOM..."
          />

          <TrackingField
            label="Comentario del gestor"
            name="managerComment"
            value={draft.managerComment}
            onChange={change}
            disabled={!canEditManager}
            placeholder="Observaciones del seguimiento..."
          />

        </div>

      </section>

      {/* RESPALDO */}
      <section className="tracking-section">

        <h3>4. Documentos de respaldo</h3>

        <div className="tracking-field">

          <label htmlFor={`url-${request.id}`}>
            URL de respaldo
          </label>

          <input
            id={`url-${request.id}`}
            type="url"
            name="url"
            value={draft.url}
            onChange={change}
            disabled={!canEdit}
            placeholder="https://..."
          />

        </div>

        {draft.url.startsWith("https://") && (
          <a
            href={draft.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-document-link"
          >
            Abrir documento de respaldo
          </a>
        )}

      </section>

      {/* GUARDAR DEMOSTRACIÓN */}
      {canEdit && (
        <div className="tracking-actions">

          <button
            type="button"
            onClick={saveDemo}
            className="tracking-save-button"
          >
            Aplicar cambios de prueba
          </button>

        </div>
      )}

      {savedMessage && (
        <p className="tracking-save-message" role="status">
          {savedMessage}
        </p>
      )}

      {/* HISTORIAL */}
      <section className="tracking-section">

        <h3>5. Historial de seguimiento</h3>

        {request.history.length === 0 ? (

          <div className="tracking-history-empty">
            Todavía no hay actualizaciones registradas
            en esta demostración.
          </div>

        ) : (

          <div className="tracking-history">

            {[...request.history].reverse().map((entry) => (

              <article
                className="tracking-history-item"
                key={entry.id}
              >

                <div className="tracking-history-marker" />

                <div>

                  <strong>{entry.author}</strong>

                  <span>{entry.date}</span>

                  <p>{entry.description}</p>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default function MyRequests() {
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const [requests, setRequests] = useState(
    SOLICITUDES_INICIALES
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const isGescom =
    user?.role?.trim().toUpperCase() === "GESCOM";

  const area = isGescom
    ? searchParams.get("area") || ""
    : user?.role || "";

  function changeArea(value) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set("area", value);
    } else {
      next.delete("area");
    }

    setSearchParams(next);
    setExpandedId(null);
  }

  // Guardado local, únicamente durante la demostración.
  function saveChanges(id, changes, author) {
    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== id) {
          return request;
        }

        const modifiedFields = Object.keys(changes).filter(
          (key) => changes[key] !== request[key]
        );

        if (modifiedFields.length === 0) {
          return request;
        }

        const entry = {
          id: crypto.randomUUID(),
          author,
          date: new Date().toLocaleString("es-CL"),
          description:
            "Actualización de seguimiento: " +
            modifiedFields.join(", ") +
            ".",
        };

        return {
          ...request,
          ...changes,
          history: [...request.history, entry],
        };
      })
    );
  }

  const filteredRequests = requests.filter((request) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      request.id.toLowerCase().includes(query) ||
      request.title.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query);

    const matchesStatus =
      !status || request.status === status;

    const matchesArea =
      !area || request.area === area;

    const matchesPriority =
      priority === "" ||
      request.priority === Number(priority);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesArea &&
      matchesPriority
    );
  });

  return (
    <div className="home-page">

      <Navbar />

      <main className="dashboard-content">

        <header className="create-request-header">

          <span className="dashboard-label">
            GESTIÓN MUNICIPAL
          </span>

          <h1>Gestionar solicitudes</h1>

        </header>

        {/* FILTROS */}
        <section className="requests-filters">

          <div className="requests-search">

            <input
              type="search"
              aria-label="Buscar solicitud"
              placeholder="Buscar solicitud..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelta">Resuelta</option>
          </select>

          {isGescom && (
            <select
              aria-label="Filtrar por área"
              value={area}
              onChange={(event) =>
                changeArea(event.target.value)
              }
            >
              <option value="">Todas las áreas</option>

              {AREAS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}

          <select
            aria-label="Filtrar por prioridad"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option value="">Todas las prioridades</option>

            {Object.entries(PRIORIDADES).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>

        </section>

        <div className="requests-results">
          {filteredRequests.length} solicitudes encontradas
        </div>

        {/* SOLICITUDES */}
        <section className="requests-list">

          {filteredRequests.length === 0 ? (

            <div className="requests-empty">

              <h2>No se encontraron solicitudes</h2>

              <p>
                Prueba modificando los filtros
                o el término de búsqueda.
              </p>

            </div>

          ) : (

            filteredRequests.map((request) => (

              <article
                className="request-item"
                key={request.id}
              >

                <div className="request-item-main">

                  <div className="request-item-info">

                    <div className="request-item-heading">

                      <h2>{request.title}</h2>

                      <span
                        className={`request-status ${
                          request.status === "Pendiente"
                            ? "status-pending"
                            : request.status === "En proceso"
                              ? "status-progress"
                              : "status-resolved"
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                    <p className="request-item-meta">
                      {request.area}
                      {" · "}
                      Prioridad {
                        PRIORIDADES[request.priority]
                      }
                    </p>

                    <p className="request-item-description">
                      {request.description}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="request-details-button"
                    aria-expanded={expandedId === request.id}
                    onClick={() =>
                      setExpandedId(
                        expandedId === request.id
                          ? null
                          : request.id
                      )
                    }
                  >
                    {expandedId === request.id
                      ? "Ocultar detalle"
                      : "Ver detalle"}
                  </button>

                </div>

                {expandedId === request.id && (

                  <RequestDetail
                    key={request.id}
                    request={request}
                    isGescom={isGescom}
                    user={user}
                    onSave={saveChanges}
                  />

                )}

              </article>

            ))

          )}

        </section>

        <p className="request-demo-disclaimer">
          Vista de demostración con solicitudes ficticias.
          Los cambios no se almacenan en MongoDB.
        </p>

      </main>

      <Footer />

    </div>
  );
}