import { performance } from "node:perf_hooks";
import { calculateEda } from "analytics-core";
import { prepareDataset } from "./analysis.service.js";

// Prepare CSV data, calculate EDA, and measure computation time.
export function runEda({ rows, columns, mapping, formats }) {
  const totalStart = performance.now();

  // Prepare and validate data using shared algorithms.
  const preparation = prepareDataset({
    rows,
    columns,
    mapping,
    formats,
  });

  // Calculate EDA using the prepared dataset.
  const edaStart = performance.now();

  const eda = calculateEda({
    result: preparation.result,
    mapping,
    columns,
    fullRows: rows,
  });

  const edaMs = performance.now() - edaStart;
  const totalMs = performance.now() - totalStart;

  return {
    eda,
    dataQuality: {
      report: preparation.result.report,
      issues: preparation.result.issues,
      outlierAnalysis: preparation.result.outlierAnalysis,
      analysisEligibility: preparation.result.analysisEligibility,
      integrity: preparation.result.integrity,
    },
    metrics: {
      preparationMs: preparation.metrics.computationMs,
      edaMs,
      totalMs,
    },
  };
}
