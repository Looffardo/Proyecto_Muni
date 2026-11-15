import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getRequests } from "../api/requestsApi";
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
  const requestId = request._id || request.id || "unknown";
  const safeHistory = Array.isArray(request.history) ? request.history : [];

  const [draft, setDraft] = useState({
    cabinetStatus: request.cabinetStatus || "No iniciado",
    reportedStatus: request.reportedStatus || "No iniciado",
    directionReport: request.directionReport || "",
    directionComment: request.directionComment || "",
    cabinetComment: request.cabinetComment || "",
    managerComment: request.managerComment || "",
    url: request.url || "",
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
    onSave(requestId, draft, user?.name || "Funcionario");

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
            <strong>{requestId}</strong>
          </div>

          <div>
            <span>Área responsable</span>
            <strong>{request.area || "Sin área"}</strong>
          </div>

          <div>
            <span>Prioridad</span>
            <strong>{PRIORIDADES[request.priority] || "Sin prioridad"}</strong>
          </div>

          <div>
            <span>Fecha de registro</span>
            <strong>
              {request.date ||
                (request.createdAt
                  ? new Date(request.createdAt).toLocaleDateString("es-CL")
                  : "Sin fecha")}
            </strong>
          </div>

          <div>
            <span>Ubicación</span>
            <strong>{request.location || "Sin ubicación"}</strong>
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

            <label htmlFor={`cabinet-${requestId}`}>
              Estado Gabinete
            </label>

            <select
              id={`cabinet-${requestId}`}
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

            <label htmlFor={`reported-${requestId}`}>
              Estado Reportado
            </label>

            <select
              id={`reported-${requestId}`}
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

          <label htmlFor={`url-${requestId}`}>
            URL de respaldo
          </label>

          <input
            id={`url-${requestId}`}
            type="url"
            name="url"
            value={draft.url}
            onChange={change}
            disabled={!canEdit}
            placeholder="https://..."
          />

        </div>

        {typeof draft.url === "string" && draft.url.startsWith("https://") && (
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

        {safeHistory.length === 0 ? (

          <div className="tracking-history-empty">
            Todavía no hay actualizaciones registradas
            para esta solicitud.
          </div>

        ) : (

          <div className="tracking-history">

            {[...safeHistory].reverse().map((entry) => (

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

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getRequests();
        setRequests(data);
      } catch (error) {
        setLoadError(error.message || "No se pudieron cargar las solicitudes.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

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
        const currentId = request._id || request.id;

        if (currentId !== id) {
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

        const history = Array.isArray(request.history) ? request.history : [];

        return {
          ...request,
          ...changes,
          history: [...history, entry],
        };
      })
    );
  }

  const filteredRequests = requests.filter((request) => {
    const query = search.trim().toLowerCase();
    const idValue = String(request._id || request.id || "");
    const titleValue = String(request.title || "");
    const descriptionValue = String(request.description || "");
    const areaValue = String(request.area || "");
    const statusValue = String(request.status || "");
    const priorityValue = Number(request.priority ?? 0);

    const matchesSearch =
      idValue.toLowerCase().includes(query) ||
      titleValue.toLowerCase().includes(query) ||
      descriptionValue.toLowerCase().includes(query);

    const matchesStatus =
      !status || statusValue === status;

    const matchesArea =
      !area || areaValue === area;

    const matchesPriority =
      priority === "" ||
      priorityValue === Number(priority);

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
          {loading
            ? "Cargando solicitudes..."
            : `${filteredRequests.length} solicitudes encontradas`}
        </div>

        {loadError && (
          <div className="requests-empty">
            <h2>Error al cargar solicitudes</h2>
            <p>{loadError}</p>
          </div>
        )}

        {/* SOLICITUDES */}
        <section className="requests-list">

          {!loading && filteredRequests.length === 0 ? (

            <div className="requests-empty">

              <h2>No se encontraron solicitudes</h2>

              <p>
                Prueba modificando los filtros
                o el término de búsqueda.
              </p>

            </div>

          ) : (

            filteredRequests.map((request) => {
              const id = String(request._id || request.id || "");
              const title = request.title || "Solicitud sin título";
              const area = request.area || "Sin área";
              const status = request.status || "Pendiente";
              const description = request.description || "Sin descripción.";
              const priority = Number(request.priority ?? 0);

              return (
                <article
                  className="request-item"
                  key={id}
                >

                <div className="request-item-main">

                  <div className="request-item-info">

                    <div className="request-item-heading">

                      <h2>{title}</h2>

                      <span
                        className={`request-status ${
                          status === "Pendiente"
                            ? "status-pending"
                            : status === "En proceso"
                              ? "status-progress"
                              : "status-resolved"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    <p className="request-item-meta">
                      {area}
                      {" · "}
                      Prioridad {PRIORIDADES[priority] || "Sin prioridad"}
                    </p>

                    <p className="request-item-description">
                      {description}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="request-details-button"
                    aria-expanded={expandedId === id}
                    onClick={() =>
                      setExpandedId(
                        expandedId === id ? null : id
                      )
                    }
                  >
                    {expandedId === id
                      ? "Ocultar detalle"
                      : "Ver detalle"}
                  </button>

                </div>

                {expandedId === id && (

                  <RequestDetail
                    key={id}
                    request={{
                      ...request,
                      id,
                      title,
                      area,
                      status,
                      description,
                      priority,
                    }}
                    isGescom={isGescom}
                    user={user}
                    onSave={saveChanges}
                  />

                )}

              </article>
              );
            })

          )}

        </section>

        {!loading && !loadError && (
          <p className="request-demo-disclaimer">
            Mostrando solicitudes
          </p>
        )}

      </main>

      <Footer />

    </div>
  );
}