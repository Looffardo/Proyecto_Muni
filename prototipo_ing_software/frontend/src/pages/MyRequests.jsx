import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import { listRequests } from "../api/requestsApi";

import "../styles/manage-requests.css";
import "../styles/request-tracking.css";

const ESTADOS = [
  "No iniciado",
  "En diseño",
  "En implementación",
  "Terminado",
  "Infactible",
  "No pertenece a unidad",
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

const ESTADO_A_STATUS = {
  "No iniciado": "Pendiente",
  "En diseño": "En proceso",
  "En implementación": "En proceso",
  Terminado: "Resuelta",
  Infactible: "Infactible",
  "No pertenece a unidad": "No pertenece a unidad",
};

const CLASE_STATUS = {
  Pendiente: "status-pending",
  "En proceso": "status-progress",
  Resuelta: "status-resolved",
  Infactible: "status-infeasible",
  "No pertenece a unidad": "status-other",
};

// Convierte una solicitud del backend al formato que usan las tarjetas.
function adaptRequest(request) {
  const cabinetStatus = request.cabinetStatus || "No iniciado";

  return {
    // El seguimiento está fuera del alcance: el backend no tiene estos campos.
    reportedStatus: cabinetStatus,
    directionReport: "",
    directionComment: "",
    cabinetComment: "",
    managerComment: "",
    url: "",
    history: [],

    ...request,

    cabinetStatus,
    title:
      request.type && request.location
        ? `${request.type} – ${request.location}`
        : (request.description || "").slice(0, 60),
    status: ESTADO_A_STATUS[cabinetStatus] || "Pendiente",
    date: new Date(request.createdAt).toLocaleDateString("es-CL", {
      timeZone: "America/Santiago",
    }),
  };
}

function TrackingField({
  label,
  name,
  value,
  placeholder,
}) {
  return (
    <div className="tracking-field">
      <label htmlFor={name}>{label}</label>

      <textarea
        id={name}
        name={name}
        value={value}
        disabled
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}

function RequestDetail({ request }) {
  const matchingStates =
    request.cabinetStatus === request.reportedStatus;

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

        <h3>2. Estado y seguimiento <span className="tracking-soon">Próximamente</span></h3>

        <div className="tracking-status-grid">

          <div className="tracking-field">

            <label htmlFor={`cabinet-${request.id}`}>
              Estado Gabinete
            </label>

            <select
              id={`cabinet-${request.id}`}
              name="cabinetStatus"
              value={request.cabinetStatus}
              disabled
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
              value={request.reportedStatus}
              disabled
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

        <h3>3. Comentarios de seguimiento <span className="tracking-soon">Próximamente</span></h3>

        <div className="tracking-comments">

          <TrackingField
            label="Comentario reportado por la dirección"
            name="directionReport"
            value={request.directionReport}
            placeholder="Justificación del estado reportado..."
          />

          <TrackingField
            label="Comentario de la dirección"
            name="directionComment"
            value={request.directionComment}
            placeholder="Acciones realizadas por el área..."
          />

          <TrackingField
            label="Comentario del gabinete"
            name="cabinetComment"
            value={request.cabinetComment}
            placeholder="Observaciones internas de GESCOM..."
          />

          <TrackingField
            label="Comentario del gestor"
            name="managerComment"
            value={request.managerComment}
            placeholder="Observaciones del seguimiento..."
          />

        </div>

      </section>

      {/* RESPALDO */}
      <section className="tracking-section">

        <h3>4. Documentos de respaldo <span className="tracking-soon">Próximamente</span></h3>

        <div className="tracking-field">

          <label htmlFor={`url-${request.id}`}>
            URL de respaldo
          </label>

          <input
            id={`url-${request.id}`}
            type="url"
            name="url"
            value={request.url}
            disabled
            placeholder="https://..."
          />

        </div>

        {request.url.startsWith("https://") && (
          <a
            href={request.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-document-link"
          >
            Abrir documento de respaldo
          </a>
        )}

      </section>

      {/* El guardado no está conectado al backend. */}
      <div className="tracking-actions">

        <button
          type="button"
          className="tracking-save-button"
          disabled
        >
          Guardar (Próximamente)
        </button>

      </div>

      {/* HISTORIAL */}
      <section className="tracking-section">

        <h3>5. Historial de seguimiento <span className="tracking-soon">Próximamente</span></h3>

        {request.history.length === 0 ? (

          <div className="tracking-history-empty">
            Todavía no hay actualizaciones registradas.
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

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let active = true;

    listRequests()
      .then((data) => {
        if (active) {
          setRequests(data.requests.map(adaptRequest));
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
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
            <option value="Infactible">Infactible</option>
            <option value="No pertenece a unidad">No pertenece a unidad</option>
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

        {!loading && !loadError && (
          <div className="requests-results">
            {filteredRequests.length} solicitudes encontradas
          </div>
        )}

        {/* SOLICITUDES */}
        <section className="requests-list">

          {loading ? (

            <div className="requests-empty" role="status">
              <p>Cargando solicitudes…</p>
            </div>

          ) : loadError ? (

            <div className="requests-empty" role="alert">
              <h2>No se pudieron cargar las solicitudes</h2>
              <p>{loadError}</p>
            </div>

          ) : filteredRequests.length === 0 ? (

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
                        className={`request-status ${CLASE_STATUS[request.status]}`}
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
                  />

                )}

              </article>

            ))

          )}

        </section>

      </main>

      <Footer />

    </div>
  );
}