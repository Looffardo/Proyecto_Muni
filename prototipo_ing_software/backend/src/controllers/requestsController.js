import {
  createRequest,
  findRequest,
  isGescom,
  listRequests,
  publicRequest,
} from "../services/requestService.js";

// Publica una solicitud (solo GESCOM)

export async function create(req, res) {
  if (!isGescom(req.user)) {
    return res.status(403).json({
      message: "Solo GESCOM puede publicar solicitudes.",
    });
  }

  const request = await createRequest(req.body, req.user);

  res.status(201).json({ request: publicRequest(request) });
}

// GESCOM ve todas; las demás áreas, solo las suyas

export async function list(req, res) {
  const requests = await listRequests(req.user);

  res.json({ requests: requests.map(publicRequest) });
}

// Una solicitud de otra área responde 404 para no revelar que existe

export async function getById(req, res) {
  const request = await findRequest(req.params.id, req.user);

  if (!request) {
    return res.status(404).json({
      message: "Solicitud no encontrada.",
    });
  }

  res.json({ request: publicRequest(request) });
}
