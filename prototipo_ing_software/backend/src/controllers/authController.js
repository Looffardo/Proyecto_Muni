import {
  registerUser,
  authenticateUser,
  publicUser,
} from "../services/authService.js";



async function startSession(req, user) {
  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  req.session.userId = String(user._id);

  await new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

// Registro de vecinos

export async function register(req, res) {
  const user = await registerUser(req.body);

  await startSession(req, user);

  res.status(201).json({ user: publicUser(user) });
}

// Inicia sesión para un usuario dado

export async function login(req, res) {
  const user = await authenticateUser(req.body);

  await startSession(req, user);

  res.json({ user: publicUser(user) });
}

// Cierra la sesión del usuario actual

export async function logout(req, res) {
  await new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  res.clearCookie("muni.sid", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.sendStatus(204);
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}