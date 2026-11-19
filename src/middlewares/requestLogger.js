import { logInfo } from "../utils/logger.js";

// Log HTTP method, route, status and request duration.
export function requestLogger(req, res, next) {
  const start = performance.now();

  res.on("finish", () => {
    logInfo("http_request", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Math.round(performance.now() - start),
    });
  });

  next();
}
