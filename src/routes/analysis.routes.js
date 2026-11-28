import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import { validateAnalysisRequest } from "../validators/analysis.schema.js";
import { validateAnalysis } from "../controllers/analysis.controller.js";
import { calculateEdaAnalysis } from "../controllers/eda.controller.js";

const router = Router();

// POST /api/analyses/validate — protected server-side validation.
router.post(
  "/validate",
  requireAuth,
  validateAnalysisRequest,
  validateAnalysis,
);

// POST /api/analyses/eda — protected server-side EDA.
router.post("/eda", requireAuth, validateAnalysisRequest, calculateEdaAnalysis);

export default router;
