import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import { SignJWT } from "jose";
import { DATE_FORMATS, AMOUNT_FORMATS } from "analytics-core";

import analysisRouter from "../../src/routes/analysis.routes.js";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { runEda } from "../../src/services/eda.service.js";

// Mock EDA calculations to test the HTTP request flow.
vi.mock("../../src/services/eda.service.js", () => ({
  runEda: vi.fn(),
}));

const userId = "550e8400-e29b-41d4-a716-446655440000";
const jwtSecret = "a".repeat(32);

const validBody = {
  rows: [{ Date: "2026-01-01", Sales: "100" }],
  columns: ["Date", "Sales"],
  mapping: {
    date: "Date",
    amount: "Sales",
    customerId: "",
    orderId: "",
    category: "",
  },
  formats: {
    date: DATE_FORMATS.YMD_DASH,
    amount: AMOUNT_FORMATS.DOT,
    twoDigitYearCentury: 2000,
  },
};

// Create a valid authentication token for API tests.
async function createToken() {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(jwtSecret));
}

// Create a minimal Express application for route testing.
function createTestApp() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use("/api/analyses", analysisRouter);
  app.use(errorHandler);

  return app;
}

describe("POST /api/analyses/eda", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = jwtSecret;
    vi.resetAllMocks();
  });

  // Require JWT authentication.
  it("returns 401 without authentication", async () => {
    const response = await request(createTestApp())
      .post("/api/analyses/eda")
      .send(validBody);

    expect(response.status).toBe(401);
    expect(runEda).not.toHaveBeenCalled();
  });

  // Reject invalid CSV input.
  it("returns 400 for invalid input", async () => {
    const token = await createToken();

    const response = await request(createTestApp())
      .post("/api/analyses/eda")
      .set("Authorization", `Bearer ${token}`)
      .send({ rows: "invalid" });

    expect(response.status).toBe(400);
    expect(runEda).not.toHaveBeenCalled();
  });

  // Return the EDA result for a valid request.
  it("returns 200 with EDA results", async () => {
    const token = await createToken();

    const expected = {
      eda: { totalRevenue: 100 },
      dataQuality: { report: { totalRows: 1 } },
      metrics: {
        preparationMs: 1,
        edaMs: 2,
        totalMs: 3,
      },
    };

    vi.mocked(runEda).mockReturnValue(expected);

    const response = await request(createTestApp())
      .post("/api/analyses/eda")
      .set("Authorization", `Bearer ${token}`)
      .send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
    expect(runEda).toHaveBeenCalledWith(validBody);
  });

  // Hide unexpected computation errors.
  it("returns 500 for unexpected service errors", async () => {
    const token = await createToken();

    vi.mocked(runEda).mockImplementation(() => {
      throw new Error("Internal EDA failure");
    });

    const response = await request(createTestApp())
      .post("/api/analyses/eda")
      .set("Authorization", `Bearer ${token}`)
      .send(validBody);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });
});
