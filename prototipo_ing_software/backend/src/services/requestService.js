import Counter from "../models/Counter.js";
import Request, {
  AREAS,
  BOUNDS,
  SOURCE_PREFIXES,
  SOURCES,
  TYPES,
} from "../models/Request.js";

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export function isGescom(user) {
  return user?.role?.trim().toUpperCase() === "GESCOM";
}

// Estructura de solicitud que se envía al frontend

export function publicRequest(request) {
  return {
    id: request.code,
    description: request.description,
    type: request.type,
    location: request.location,
    area: request.area,
    mayorCommitment: request.mayorCommitment,
    priority: request.priority,
    manager: request.manager,
    organization: request.organization,
    macroSector: request.macroSector,
    source: request.source,
    lat: request.lat ?? null,
    lng: request.lng ?? null,
    cabinetStatus: request.cabinetStatus,
    createdBy: String(request.createdBy),
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

// Validación de campos de texto

function requiredText(value, label, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    throw badRequest(`Completa el campo ${label}.`);
  }

  if (text.length > maxLength) {
    throw badRequest(`El campo ${label} no puede superar ${maxLength} caracteres.`);
  }

  return text;
}

function optionalText(value, label, maxLength) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    throw badRequest(`El campo ${label} no es válido.`);
  }

  const text = value.trim();

  if (text.length > maxLength) {
    throw badRequest(`El campo ${label} no puede superar ${maxLength} caracteres.`);
  }

  return text;
}

function oneOf(value, allowed, label) {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw badRequest(`El campo ${label} no es válido.`);
  }

  return value;
}

// El formulario envía la prioridad como texto ("0" a "3")

function parsePriority(value) {
  const isValid =
    (typeof value === "string" && /^[0-3]$/.test(value)) ||
    (Number.isInteger(value) && value >= 0 && value <= 3);

  if (!isValid) {
    throw badRequest("La prioridad no es válida.");
  }

  return Number(value);
}

function parseCoordinates(body) {
  const lat = body?.lat ?? null;
  const lng = body?.lng ?? null;

  if (lat === null && lng === null) {
    return {};
  }

  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    lat < BOUNDS.lat.min ||
    lat > BOUNDS.lat.max ||
    lng < BOUNDS.lng.min ||
    lng > BOUNDS.lng.max
  ) {
    throw badRequest("Las coordenadas no son válidas.");
  }

  return { lat, lng };
}

function validateRequest(body) {
  const mayorCommitment = body?.mayorCommitment ?? false;

  if (typeof mayorCommitment !== "boolean") {
    throw badRequest("El compromiso del alcalde no es válido.");
  }

  return {
    description: requiredText(body?.description, "descripción", 2000),
    type: oneOf(body?.type, TYPES, "tipo de solicitud"),
    location: requiredText(body?.location, "ubicación", 200),
    area: oneOf(body?.area, AREAS, "dirección responsable"),
    mayorCommitment,
    priority: parsePriority(body?.priority),
    manager: optionalText(body?.manager, "gestor responsable", 120),
    organization: optionalText(body?.organization, "organización", 120),
    macroSector: optionalText(body?.macroSector, "macrosector", 120),
    source: oneOf(body?.source, SOURCES, "fuente"),
    ...parseCoordinates(body),
  };
}

// Correlativo atómico: dos publicaciones simultáneas nunca reciben el mismo número.
// La primera vez que se usa un prefijo, dos upsert simultáneos pueden chocar (E11000);
// en ese caso el documento ya existe y basta con reintentar.

async function nextCode(source) {
  const prefix = SOURCE_PREFIXES[source];

  for (let attempt = 0; ; attempt += 1) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: prefix },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: "after" }
      );

      return `${prefix}-${String(counter.seq).padStart(4, "0")}`;
    } catch (error) {
      if (error.code !== 11000 || attempt >= 2) {
        throw error;
      }
    }
  }
}

export async function createRequest(body, user) {
  // Se valida antes de pedir el número, para no gastar correlativos.
  const data = validateRequest(body);
  const code = await nextCode(data.source);

  return Request.create({ ...data, code, createdBy: user._id });
}

// Filtro de visibilidad. Devuelve null si el usuario no puede ver ninguna solicitud:
// el rol es opcional en User y un filtro sin área podría devolverlas todas.

function visibilityFilter(user) {
  if (isGescom(user)) {
    return {};
  }

  return user?.role ? { area: user.role } : null;
}

export async function listRequests(user) {
  const filter = visibilityFilter(user);

  if (!filter) {
    return [];
  }

  return Request.find(filter).sort({ createdAt: -1 });
}

export async function findRequest(code, user) {
  const filter = visibilityFilter(user);

  if (!filter) {
    return null;
  }

  return Request.findOne({ ...filter, code });
}
