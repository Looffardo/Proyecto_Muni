export async function authRequest(path, body) {
  let response;

  try {
    response = await fetch(`/api/auth/${path}`, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      headers:
        body === undefined
          ? {}
          : {
              "Content-Type": "application/json",
              "X-Requested-With": "muni-web",
            },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("No se pudo conectar al servidor.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(
      new Error(
        data.message ||
          "No se pudo completar la solicitud. Comprueba que el backend esté iniciado."
      ),
      { status: response.status }
    );
  }

  return data;
}