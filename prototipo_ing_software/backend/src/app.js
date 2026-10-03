import express from "express";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

// Configuración de la aplicación Express

export default function createApp({
  store,
  secret,
  frontendOrigin = "http://localhost:5173",
}) {
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET debe tener al menos 32 caracteres.");
  }

  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "16kb" }));

  // Configuración de la sesión y protección de rutas

  app.use("/api", (req, res, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      if (
        req.get("X-Requested-With") !== "muni-web" ||
        !req.is("application/json")
      ) {
        return res.status(403).json({
          message: "Solicitud no permitida.",
        });
      }

      if (
        req.get("origin") &&
        req.get("origin") !== frontendOrigin
      ) {
        return res.status(403).json({
          message: "Origen no permitido.",
        });
      }
    }

    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(
    session({
      name: "muni.sid",
      secret,
      store,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use("/api/auth", authRoutes);

  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Ruta no encontrada." });
  });

  app.use((err, _req, res, _next) => {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Ese correo ya está registrado.",
      });
    }

    if (err.status === 400 || err.status === 401) {
      return res.status(err.status).json({
        message:
          err.type === "entity.parse.failed"
            ? "JSON no válido."
            : err.message,
      });
    }

    console.error("Error de API:", err.name);

    res.status(500).json({
      message: "No pudimos completar la operación. Intenta nuevamente.",
    });
  });

  return app;
}