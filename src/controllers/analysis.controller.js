import { prepareDataset } from "../services/analysis.service.js";

// POST /api/analyses/validate — validate and prepare business data.
export function validateAnalysis(req, res, next) {
  try {
    const response = prepareDataset(req.body);

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}
