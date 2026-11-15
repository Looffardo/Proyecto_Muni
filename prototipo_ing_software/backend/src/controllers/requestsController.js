import {
  createRequestEntry,
  findRequestByCode,
  getRequestsList,
  isGescom,
} from "../services/requestService.js";

// Solo GESCOM puede publicar solicitudes

export async function createRequest(req, res) {
  if (!isGescom(req.user)) {
    return res.status(403).json({
      message: "Solo GESCOM puede publicar solicitudes.",
    });
  }

  const request = await createRequestEntry(req.body, req.user);

  res.status(201).json({
    message: "Solicitud creada correctamente.",
    request,
  });
}

// GESCOM ve todas; las demás áreas, solo las suyas

export async function listRequests(req, res) {
  const requests = await getRequestsList(req.user);

  res.status(200).json({ requests });
}

// Detalle por ID legible (code). Una solicitud de otra área responde 404.

export async function getRequest(req, res) {
  const request = await findRequestByCode(req.params.code, req.user);

  if (!request) {
    return res.status(404).json({
      message: "Solicitud no encontrada.",
    });
  }

  res.status(200).json({ request });
}
