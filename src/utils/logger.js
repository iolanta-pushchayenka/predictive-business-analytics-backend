// Write structured application logs without sensitive data.
export function logInfo(event, details = {}) {
  console.info(
    JSON.stringify({
      level: "info",
      event,
      ...details,
      timestamp: new Date().toISOString(),
    }),
  );
}

// Write structured error logs without exposing internal details to users.
export function logError(event, details = {}) {
  console.error(
    JSON.stringify({
      level: "error",
      event,
      ...details,
      timestamp: new Date().toISOString(),
    }),
  );
}
