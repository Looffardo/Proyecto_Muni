import { createRequestEntry, getRequestsList } from "../services/requestService.js";

function normalizeRole(value = "") {
  return String(value).trim().toLowerCase();
}

function filterRequestsByUser(requests, user) {
  if (!user) {
    return [];
  }

  const userRole = normalizeRole(user.role);

  if (userRole === "gescom") {
    return requests;
  }

  return requests.filter(
    (request) => normalizeRole(request.area) === userRole
  );
}

export async function createRequest(req, res) {
  const request = await createRequestEntry(req.body);

  res.status(201).json({
    message: "Solicitud creada correctamente.",
    request,
  });
}

export async function listRequests(req, res) {
  const requests = await getRequestsList();
  const visibleRequests = filterRequestsByUser(requests, req.user);

  res.status(200).json({ requests: visibleRequests });
}
