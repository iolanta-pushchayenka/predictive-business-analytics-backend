import { readFileSync } from "node:fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

// Load the OpenAPI specification from the repository.
const openApiPath = new URL("../../docs/api/openapi.yaml", import.meta.url);

const openApiContent = readFileSync(openApiPath, "utf8");
const openApiDocument = YAML.parse(openApiContent);

// Register the Swagger UI documentation route.
export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}
