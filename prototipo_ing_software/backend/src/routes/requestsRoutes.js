import { Router } from "express";
import { createRequest, listRequests } from "../controllers/requestsController.js";

const router = Router();

router.get("/", listRequests);
router.post("/", createRequest);

export default router;
