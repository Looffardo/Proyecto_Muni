import { createRequestEntry, getRequestsList } from "../services/requestService.js";

export async function createRequest(req, res) {
  const request = await createRequestEntry(req.body);

  res.status(201).json({
    message: "Solicitud creada correctamente.",
    request,
  });
}

export async function listRequests(_req, res) {
  const requests = await getRequestsList();

  res.status(200).json({ requests });
}
