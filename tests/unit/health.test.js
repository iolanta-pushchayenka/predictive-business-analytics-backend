import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Health API", () => {
  // Return a successful health response.
  it("returns 200 for GET /api/health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
    });
  });

  // Return 404 for an unknown API route.
  it("returns 404 for an unknown endpoint", async () => {
    const response = await request(app).get("/api/unknown");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "API endpoint not found",
    });
  });
});
