import { Router } from "express";

import {
  create,
  list,
  getById,
} from "../controllers/requestsController.js";

import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", create);
router.get("/", list);
router.get("/:id", getById);

export default router;
