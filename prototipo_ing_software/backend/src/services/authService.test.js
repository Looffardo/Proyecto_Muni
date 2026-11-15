import assert from "node:assert/strict";
import test from "node:test";
import {
  authenticateUser,
  publicUser,
  registerUser,
} from "./authService.js";

test("rechaza un correo inválido antes de consultar usuarios", async () => {
  await assert.rejects(
    authenticateUser({ email: "correo-invalido", password: "password123" }),
    { message: "Ingresa un correo válido.", status: 400 }
  );
});

test("rechaza contraseñas cortas durante el registro", async () => {
  await assert.rejects(
    registerUser({
      name: "Funcionario",
      email: "funcionario@muni.cl",
      password: "short",
      role: "GESCOM",
    }),
    {
      message: "La contraseña debe tener al menos 8 caracteres",
      status: 400,
    }
  );
});

test("rechaza roles no habilitados durante el registro", async () => {
  await assert.rejects(
    registerUser({
      name: "Funcionario",
      email: "funcionario@muni.cl",
      password: "password123",
      role: "Administrador externo",
    }),
    { message: "Rol inválido.", status: 400 }
  );
});

test("publica solo los datos no sensibles del usuario", () => {
  const user = publicUser({
    _id: "user-id",
    name: "Funcionario",
    email: "funcionario@muni.cl",
    role: "GESCOM",
    passwordHash: "secret-hash",
  });

  assert.deepEqual(user, {
    id: "user-id",
    name: "Funcionario",
    email: "funcionario@muni.cl",
    role: "GESCOM",
  });
  assert.equal("passwordHash" in user, false);
});
