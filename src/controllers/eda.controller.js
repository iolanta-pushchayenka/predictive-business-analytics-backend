import { runEda } from "../services/eda.service.js";

// POST /api/analyses/eda — calculate server-side EDA.
export function calculateEdaAnalysis(req, res, next) {
  try {
    const response = runEda(req.body);

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}
