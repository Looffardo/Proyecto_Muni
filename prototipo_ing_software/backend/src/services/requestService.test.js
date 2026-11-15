import assert from "node:assert/strict";
import test from "node:test";
import Counter from "../models/Counter.js";
import Request from "../models/Request.js";
import {
  createRequestEntry,
  findRequestByCode,
  getRequestsList,
  validateRequestBody,
  visibilityFilter,
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

test("rechaza área, tipo, fuente o prioridad fuera de la lista", () => {
  assert.throws(
    () => validateRequestBody({ ...validRequest, area: "Área inventada" }),
    { message: "El área responsable no es válida.", status: 400 }
  );
  assert.throws(
    () => validateRequestBody({ ...validRequest, type: "Otro tipo" }),
    { message: "El tipo de solicitud no es válido.", status: 400 }
  );
  assert.throws(
    () => validateRequestBody({ ...validRequest, source: "Fuente rara" }),
    { message: "La fuente no es válida.", status: 400 }
  );
  assert.throws(
    () => validateRequestBody({ ...validRequest, priority: "7" }),
    { status: 400 }
  );
  assert.throws(
    () => validateRequestBody({ ...validRequest, priority: undefined }),
    { status: 400 }
  );
});

test("la fuente es opcional", () => {
  assert.equal(validateRequestBody({ ...validRequest, source: "" }).source, "");
  assert.equal(
    validateRequestBody({ ...validRequest, source: "Terreno" }).source,
    "Terreno"
  );
});

test("guarda quién creó la solicitud", async () => {
  const originalFindByIdAndUpdate = Counter.findByIdAndUpdate;
  const originalCreate = Request.create;
  const originalFetch = globalThis.fetch;

  Counter.findByIdAndUpdate = async () => ({ sequence: 1 });
  Request.create = async (data) => data;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => [{ lat: "-33.45", lon: "-70.55" }],
  });

  try {
    const created = await createRequestEntry(validRequest, {
      _id: "usuario-gescom",
      role: "GESCOM",
    });

    assert.equal(created.createdBy, "usuario-gescom");
  } finally {
    Counter.findByIdAndUpdate = originalFindByIdAndUpdate;
    Request.create = originalCreate;
    globalThis.fetch = originalFetch;
  }
});

test("GESCOM ve todo y cada área solo lo suyo", () => {
  assert.deepEqual(visibilityFilter({ role: "GESCOM" }), {});
  assert.deepEqual(visibilityFilter({ role: "Tránsito" }), { area: "Tránsito" });
  assert.equal(visibilityFilter({}), null);
  assert.equal(visibilityFilter(null), null);
});

test("filtra la lista en la consulta a MongoDB", async () => {
  const originalFind = Request.find;
  let capturedFilter;

  Request.find = (filter) => {
    capturedFilter = filter;
    return { sort: async () => [] };
  };

  try {
    await getRequestsList({ role: "DOM" });
    assert.deepEqual(capturedFilter, { area: "DOM" });

    capturedFilter = undefined;
    assert.deepEqual(await getRequestsList({}), []);
    assert.equal(capturedFilter, undefined);
  } finally {
    Request.find = originalFind;
  }
});

test("busca por código respetando el área del usuario", async () => {
  const originalFindOne = Request.findOne;
  let capturedFilter;

  Request.findOne = async (filter) => {
    capturedFilter = filter;
    return null;
  };

  try {
    await findRequestByCode("5", { role: "DOM" });
    assert.deepEqual(capturedFilter, { area: "DOM", code: 5 });

    capturedFilter = undefined;
    assert.equal(await findRequestByCode("abc", { role: "GESCOM" }), null);
    assert.equal(capturedFilter, undefined);
  } finally {
    Request.findOne = originalFindOne;
  }
});
