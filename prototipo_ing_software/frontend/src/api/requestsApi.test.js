import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { createRequest, getRequests } from "./requestsApi.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("createRequest envía sesión, cabeceras y datos esperados", async () => {
  let capturedUrl;
  let capturedOptions;
  const payload = { title: "Luminaria dañada", priority: 2 };

  globalThis.fetch = async (url, options) => {
    capturedUrl = url;
    capturedOptions = options;
    return {
      ok: true,
      json: async () => ({ request: { code: 1 } }),
    };
  };

  const result = await createRequest(payload);

  assert.equal(capturedUrl, "/api/requests");
  assert.equal(capturedOptions.method, "POST");
  assert.equal(capturedOptions.credentials, "same-origin");
  assert.equal(capturedOptions.headers["X-Requested-With"], "muni-web");
  assert.deepEqual(JSON.parse(capturedOptions.body), payload);
  assert.deepEqual(result, { request: { code: 1 } });
});

test("createRequest conserva el error y estado que devuelve la API", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 409,
    json: async () => ({ message: "Conflicto de solicitud." }),
  });

  await assert.rejects(createRequest({}), {
    message: "Conflicto de solicitud.",
    status: 409,
  });
});

test("createRequest informa fallos de conexión", async () => {
  globalThis.fetch = async () => {
    throw new Error("offline");
  };

  await assert.rejects(createRequest({}), {
    message: "No se pudo conectar al servidor.",
  });
});

test("getRequests devuelve la lista de la API", async () => {
  const requests = [{ code: 1 }, { code: 2 }];

  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/requests");
    assert.equal(options.method, "GET");
    assert.equal(options.headers["X-Requested-With"], "muni-web");
    return {
      ok: true,
      json: async () => ({ requests }),
    };
  };

  assert.deepEqual(await getRequests(), requests);
});
