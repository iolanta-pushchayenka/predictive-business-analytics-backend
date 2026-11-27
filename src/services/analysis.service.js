import { performance } from "node:perf_hooks";
import { validateDataset } from "analytics-core";

// Validate and prepare business data using the shared library.
export function prepareDataset({ rows, columns, mapping, formats }) {
  const startTime = performance.now();

  const result = validateDataset(rows, columns, mapping, formats);

  const computationMs = performance.now() - startTime;

  return {
    result,
    metrics: {
      computationMs,
    },
  };
}
