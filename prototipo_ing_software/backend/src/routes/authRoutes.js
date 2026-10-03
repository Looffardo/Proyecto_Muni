import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  register,
  login,
  logout,
  me,
} from "../controllers/authController.js";

import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

// Limitar la cantidad de intentos de inicio de sesión y registro para prevenir ataques de fuerza bruta

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Demasiados intentos. Intenta nuevamente en 15 minutos.",
  },
});

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;