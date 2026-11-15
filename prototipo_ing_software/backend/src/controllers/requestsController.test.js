import assert from "node:assert/strict";
import test from "node:test";
import Request from "../models/Request.js";
import { createRequest, getRequest } from "./requestsController.js";

function fakeResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

test("un área que no es GESCOM no puede publicar solicitudes", async () => {
  const res = fakeResponse();

  await createRequest({ user: { role: "Tránsito" }, body: {} }, res);

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.message, "Solo GESCOM puede publicar solicitudes.");
});

test("una solicitud no visible responde 404", async () => {
  const originalFindOne = Request.findOne;
  Request.findOne = async () => null;

  try {
    const res = fakeResponse();
    await getRequest({ user: { role: "DOM" }, params: { code: "3" } }, res);

    assert.equal(res.statusCode, 404);
  } finally {
    Request.findOne = originalFindOne;
  }
});
