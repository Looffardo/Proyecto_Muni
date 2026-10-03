import User from "../models/User.js";

// Middleware para comprobar si el usuario está autenticado antes de permitir el acceso

export default async function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Debes iniciar sesión.",
    });
  }

  const user = await User.findById(req.session.userId);

  if (!user) {
    return res.status(401).json({
      message: "Sesión no válida.",
    });
  }

  req.user = user;
  next();
}