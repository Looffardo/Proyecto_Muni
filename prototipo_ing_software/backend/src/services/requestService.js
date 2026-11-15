import Request from "../models/Request.js";

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

  if (!location) {
    throw Object.assign(new Error("La ubicación es obligatoria."), { status: 400 });
  }

  if (!area) {
    throw Object.assign(new Error("Debes seleccionar un área responsable."), { status: 400 });
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

export async function createRequestEntry(body) {
  const requestData = validateRequestBody(body);
  const coordinates = await geocodeLocation(requestData.location);

  return Request.create({
    ...requestData,
    ...coordinates,
  });
}

export async function getRequestsList() {
  return Request.find({}).sort({ createdAt: -1 });
}
