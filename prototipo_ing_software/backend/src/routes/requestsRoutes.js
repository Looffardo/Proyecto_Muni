import { Router } from "express";
import {
  createRequest,
  getRequest,
  listRequests,
} from "../controllers/requestsController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, listRequests);
router.post("/", requireAuth, createRequest);
router.get("/:code", requireAuth, getRequest);

export default router;
