import Request from "../models/Request.js";
import Counter from "../models/Counter.js";
import { AREAS, SOURCES, TYPES } from "../constants/requestOptions.js";

export function isGescom(user) {
  return String(user?.role || "").trim().toUpperCase() === "GESCOM";
}

// GESCOM ve todas las solicitudes; cada área, solo las suyas.
// Devuelve null si el usuario no tiene un rol con acceso.

export function visibilityFilter(user) {
  if (isGescom(user)) return {};
  if (!user?.role) return null;
  return { area: user.role };
}

async function getNextRequestCode() {
  const counter = await Counter.findByIdAndUpdate(
    "request",
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error("No se pudo asignar el código de la solicitud.");
  }

  return counter.sequence;
}

export async function initializeRequestCodes() {
  const [highestRequest] = await Request.collection
    .find({ code: { $type: "number" } })
    .sort({ code: -1 })
    .limit(1)
    .toArray();

  await Counter.collection.updateOne(
    { _id: "request" },
    { $max: { sequence: highestRequest?.code || 0 } },
    { upsert: true }
  );

  const requestsWithoutCode = await Request.collection
    .find({ code: null })
    .sort({ _id: 1 })
    .project({ _id: 1 })
    .toArray();

  for (const request of requestsWithoutCode) {
    const code = await getNextRequestCode();

    await Request.collection.updateOne(
      { _id: request._id, code: null },
      { $set: { code } }
    );
  }
}

function sanitizeText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}


// Geocodificación de ubicación usando Nominatim (OpenStreetMap)
async function geocodeLocation(location) {
  const query = sanitizeText(location);

  if (!query) {
    throw Object.assign(new Error("La ubicación es obligatoria."), { status: 400 });
  }

  const searchCandidates = [
    query,
    `${query}, Peñalolén, Chile`,
    `${query}, Región Metropolitana, Chile`,
    `${query}, Santiago, Chile`,
  ];

  for (const candidate of searchCandidates) {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("countrycodes", "cl");
    url.searchParams.set("q", candidate);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "muni-app/1.0 (proyecto-muni)",
        "Accept-Language": "es",
      },
    });

    if (!response.ok) {
      continue;
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const latitude = Number.parseFloat(data[0].lat);
      const longitude = Number.parseFloat(data[0].lon);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { latitude, longitude };
      }
    }
  }

  throw Object.assign(new Error("No se encontraron coordenadas para esa dirección."), { status: 400 });
}

export function validateRequestBody(body = {}) {
  const title = sanitizeText(body.title);
  const description = sanitizeText(body.description);
  const type = sanitizeText(body.type);
  const location = sanitizeText(body.location);
  const area = sanitizeText(body.area);
  const priorityValue = Number(body.priority);
  const manager = sanitizeText(body.manager);
  const organization = sanitizeText(body.organization);
  const macroSector = sanitizeText(body.macroSector);
  const source = sanitizeText(body.source);
  const mayorCommitment = Boolean(body.mayorCommitment);

  if (!title || title.length < 3 || title.length > 120) {
    throw Object.assign(new Error("El título debe tener entre 3 y 120 caracteres."), { status: 400 });
  }

  if (!description || description.length > 2000) {
    throw Object.assign(new Error("La descripción debe tener menos de 2000 caracteres."), { status: 400 });
  }

  if (!type) {
    throw Object.assign(new Error("Debes seleccionar un tipo de solicitud."), { status: 400 });
  }

  if (!TYPES.includes(type)) {
    throw Object.assign(new Error("El tipo de solicitud no es válido."), { status: 400 });
  }

  if (!location) {
    throw Object.assign(new Error("La ubicación es obligatoria."), { status: 400 });
  }

  if (!area) {
    throw Object.assign(new Error("Debes seleccionar un área responsable."), { status: 400 });
  }

  if (!AREAS.includes(area)) {
    throw Object.assign(new Error("El área responsable no es válida."), { status: 400 });
  }

  if (!Number.isInteger(priorityValue) || priorityValue < 0 || priorityValue > 3) {
    throw Object.assign(new Error("Debes seleccionar una prioridad entre 0 y 3."), { status: 400 });
  }

  // La fuente es opcional, pero si viene debe ser una de la lista
  if (source && !SOURCES.includes(source)) {
    throw Object.assign(new Error("La fuente no es válida."), { status: 400 });
  }

  return {
    title,
    description,
    type,
    location,
    area,
    mayorCommitment,
    priority: priorityValue,
    manager,
    organization,
    macroSector,
    source,
  };
}

export async function createRequestEntry(body, user) {
  const requestData = validateRequestBody(body);
  const coordinates = await geocodeLocation(requestData.location);
  const code = await getNextRequestCode();

  return Request.create({
    ...requestData,
    ...coordinates,
    code,
    createdBy: user?._id ?? null,
  });
}

// El filtro por área se aplica en la consulta, no después en memoria

export async function getRequestsList(user) {
  const filter = visibilityFilter(user);
  if (!filter) return [];

  return Request.find(filter).sort({ createdAt: -1 });
}

// Busca por el ID legible (code). Si es de otra área, responde como si no existiera.

export async function findRequestByCode(codeParam, user) {
  const code = Number(codeParam);
  const filter = visibilityFilter(user);

  if (!Number.isInteger(code) || code < 1 || !filter) return null;

  return Request.findOne({ ...filter, code });
}
