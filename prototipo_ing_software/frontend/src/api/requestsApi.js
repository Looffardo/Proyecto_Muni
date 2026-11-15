export async function createRequest(payload) {
  let response;

  try {
    response = await fetch("/api/requests", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "muni-web",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("No se pudo conectar al servidor.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(
      new Error(
        data.message ||
          "No se pudo publicar la solicitud. Revisa el backend."
      ),
      { status: response.status }
    );
  }

  return data;
}

export async function getRequests() {
  let response;

  try {
    response = await fetch("/api/requests", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "muni-web",
      },
    });
  } catch {
    throw new Error("No se pudo conectar al servidor.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(
      new Error(
        data.message || "No se pudieron cargar las solicitudes."
      ),
      { status: response.status }
    );
  }

  return data.requests || [];
}
