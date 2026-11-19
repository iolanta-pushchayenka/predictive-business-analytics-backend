import { logError } from "../utils/logger.js";

// Return 404 when no API route matches the request.
export function notFound(req, res) {
  return res.status(404).json({
    error: "API endpoint not found",
  });
}

// Handle application errors in one place.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;

  const safeStatus = status >= 400 && status < 600 ? status : 500;

  // Record the server error without logging request data.
  logError("api_error", {
    method: req.method,
    status: safeStatus,
    errorType: err.name || "Error",
  });

  const message =
    safeStatus >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  return res.status(safeStatus).json({
    error: message,
  });
}
