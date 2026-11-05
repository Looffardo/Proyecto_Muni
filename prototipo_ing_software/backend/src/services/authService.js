import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Dummy hash para proteger contra ataques de temporización

const dummyHash = await bcrypt.hash("unused-login-timing-placeholder", 12);

// Estructura Usuario

export function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// Validación de credenciales (Proteccion de memoria disponible)

function validateCredentials(body, registering = false) {
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  const password =
    typeof body?.password === "string" ? body.password : "";

  const name =
    typeof body?.name === "string" ? body.name.trim() : "";

  const role = 
    typeof body?.role === "string" ? body.role.trim() : "";

  const allowedRoles = [
  "Tránsito",
  "Espacios Públicos",
  "Inspección",
  "Seguridad Humana",
  "Deportes",
  "DIDECO",
  "Jurídico",
  "DOM",
  "SECPLA",
  "Delegación Peñalolén Alto",
  "GESCOM",
];

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw Object.assign(new Error("Ingresa un correo válido."), {
      status: 400,
    });
  }

  if (
    !password ||
    Buffer.byteLength(password, "utf8") > 72 ||
    (registering && password.length < 8)
  ) {
    throw Object.assign(
      new Error(
        "La contraseña debe tener al menos 8 caracteres"
      ),
      { status: 400 }
    );
  }

  if (registering && (name.length < 2 || name.length > 80)) {
    throw Object.assign(
      new Error("El nombre debe tener entre 2 y 80 caracteres."),
      { status: 400 }
    );
  }

  if (registering && !allowedRoles.includes(role)) {
    throw Object.assign(
      new Error("Rol inválido."),
      { status: 400 }
    );
  }

  return { email, password, name, role };
}

// Registro y autenticación de vecinos

export async function registerUser(body) {
  const { name, email, password, role } = validateCredentials(body, true);

  const passwordHash = await bcrypt.hash(password, 12);

  return User.create({
    name,
    email,
    passwordHash,
    role,
  });
}

// Login de usuario

export async function authenticateUser(body) {
  const { email, password } = validateCredentials(body);

  const user = await User.findOne({ email }).select("+passwordHash");

  const matches = await bcrypt.compare(
    password,
    user?.passwordHash || dummyHash
  );

  if (!user || !matches) {
    throw Object.assign(
      new Error("Correo o contraseña incorrectos."),
      { status: 401 }
    );
  }

  return user;
}