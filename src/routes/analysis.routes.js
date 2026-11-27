import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { validateAnalysisRequest } from "../validators/analysis.schema.js";
import { validateAnalysis } from "../controllers/analysis.controller.js";

const router = Router();

// POST /api/analyses/validate — protected server-side validation.
router.post(
  "/validate",
  requireAuth,
  validateAnalysisRequest,
  validateAnalysis,
);

export default router;
