import { validateMapping, DATE_FORMATS, AMOUNT_FORMATS } from "analytics-core";

const MAX_ROWS = 50_000;
const MAX_COLUMNS = 100;

const VALID_DATE_FORMATS = new Set(Object.values(DATE_FORMATS));
const VALID_AMOUNT_FORMATS = new Set(Object.values(AMOUNT_FORMATS));

// Validate the structure and content of an analysis request.
export function validateAnalysisRequest(req, res, next) {
  const { rows, columns, mapping, formats } = req.body ?? {};

  // Reject missing or incorrectly structured request fields.
  if (
    !Array.isArray(rows) ||
    !Array.isArray(columns) ||
    !mapping ||
    typeof mapping !== "object" ||
    Array.isArray(mapping) ||
    !formats ||
    typeof formats !== "object" ||
    Array.isArray(formats)
  ) {
    return res.status(400).json({
      error: "Invalid analysis request structure",
    });
  }

  // Reject datasets exceeding the configured limits.
  if (rows.length > MAX_ROWS || columns.length > MAX_COLUMNS) {
    return res.status(413).json({
      error: "Dataset exceeds the allowed limits",
    });
  }

  // Reject empty datasets.
  if (rows.length === 0 || columns.length === 0) {
    return res.status(400).json({
      error: "CSV must contain columns and data rows",
    });
  }

  // Reject invalid or duplicate CSV column names.
  if (
    !columns.every(
      (column) => typeof column === "string" && column.trim().length > 0,
    ) ||
    new Set(columns).size !== columns.length
  ) {
    return res.status(400).json({
      error: "Invalid or duplicate CSV columns",
    });
  }

  // Reject unsupported date and amount formats.
  if (
    !VALID_DATE_FORMATS.has(formats.date) ||
    !VALID_AMOUNT_FORMATS.has(formats.amount)
  ) {
    return res.status(400).json({
      error: "Unsupported date or amount format",
    });
  }

  // Validate the two-digit year setting using analytics-core rules.
  if (
    formats.twoDigitYearCentury !== undefined &&
    (!Number.isInteger(formats.twoDigitYearCentury) ||
      formats.twoDigitYearCentury < 0 ||
      formats.twoDigitYearCentury > 9900 ||
      formats.twoDigitYearCentury % 100 !== 0)
  ) {
    return res.status(400).json({
      error: "Invalid two-digit year century",
    });
  }

  // Validate CSV row values and column membership.
  const allowedColumns = new Set(columns);

  if (
    !rows.every(
      (row) =>
        row !== null &&
        typeof row === "object" &&
        !Array.isArray(row) &&
        Object.entries(row).every(
          ([key, value]) =>
            allowedColumns.has(key) &&
            (value === null ||
              typeof value === "string" ||
              (typeof value === "number" && Number.isFinite(value))),
        ),
    )
  ) {
    return res.status(400).json({
      error: "Invalid CSV rows",
    });
  }

  // Ensure the selected columns exist and are not mapped twice.
  try {
    validateMapping(columns, mapping);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid column mapping",
    });
  }

  next();
}
