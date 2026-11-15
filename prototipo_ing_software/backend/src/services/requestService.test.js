import assert from "node:assert/strict";
import test from "node:test";
import Counter from "../models/Counter.js";
import Request from "../models/Request.js";
import {
  createRequestEntry,
  validateRequestBody,
} from "./requestService.js";

const validRequest = {
  title: "Luminaria dañada",
  description: "La luminaria de la esquina no funciona.",
  type: "Alumbrado Público",
  location: "Av. Diagonal Las Torres 2000, Peñalolén",
  area: "Espacios Públicos",
  priority: "2",
  manager: "Gestor compartido",
  organization: "Organización compartida",
  macroSector: "Macrosector compartido",
};

test("normaliza texto y campos opcionales sin impedir valores repetidos", () => {
  const first = validateRequestBody(validRequest);
  const second = validateRequestBody(validRequest);

  assert.equal(first.title, "Luminaria dañada");
  assert.equal(first.priority, 2);
  assert.equal(first.mayorCommitment, false);
  assert.equal(first.manager, "Gestor compartido");
  assert.deepEqual(first, second);
});

test("rechaza datos requeridos incompletos", () => {
  assert.throws(
    () => validateRequestBody({ ...validRequest, area: " " }),
    { message: "Debes seleccionar un área responsable.", status: 400 }
  );
});

test("el modelo requiere code y declara su índice único", async () => {
  const request = new Request({
    ...validRequest,
    priority: 2,
  });

  await assert.rejects(request.validate(), (error) => {
    assert.ok(error.errors.code);
    return true;
  });

  const codeIndex = Request.schema
    .indexes()
    .find(([keys, options]) => keys.code === 1 && options.unique);

  assert.ok(codeIndex, "code (ID) debe tener un índice único");
});

test("rechaza códigos inferiores al mínimo", async () => {
  const request = new Request({
    ...validRequest,
    priority: 2,
    code: 0,
  });

  await assert.rejects(request.validate(), (error) => {
    assert.ok(error.errors.code);
    return true;
  });
});

test("asigna códigos consecutivos a solicitudes creadas concurrentemente", async () => {
  const originalFindByIdAndUpdate = Counter.findByIdAndUpdate;
  const originalCreate = Request.create;
  const originalFetch = globalThis.fetch;
  let sequence = 0;

  Counter.findByIdAndUpdate = async (_id, update, options) => {
    assert.deepEqual(update, { $inc: { sequence: 1 } });
    assert.equal(options.upsert, true);
    sequence += 1;
    return { sequence };
  };
  Request.create = async (data) => data;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => [{ lat: "-33.45", lon: "-70.55" }],
  });

  try {
    const [first, second] = await Promise.all([
      createRequestEntry(validRequest),
      createRequestEntry(validRequest),
    ]);

    assert.deepEqual([first.code, second.code].sort(), [1, 2]);
    assert.equal(first.latitude, -33.45);
    assert.equal(second.longitude, -70.55);
  } finally {
    Counter.findByIdAndUpdate = originalFindByIdAndUpdate;
    Request.create = originalCreate;
    globalThis.fetch = originalFetch;
  }
});
