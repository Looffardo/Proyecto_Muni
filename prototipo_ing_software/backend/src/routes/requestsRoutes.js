import { Router } from "express";
import { createRequest, listRequests } from "../controllers/requestsController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, listRequests);
router.post("/", requireAuth, createRequest);

export default router;
