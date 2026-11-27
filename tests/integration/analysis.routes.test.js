import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import { SignJWT } from "jose";
import analysisRouter from "../../src/routes/analysis.routes.js";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { prepareDataset } from "../../src/services/analysis.service.js";

// Mock calculations while testing HTTP routing and error handling.
vi.mock("../../src/services/analysis.service.js", () => ({
  prepareDataset: vi.fn(),
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
    date: "YMD_DASH",
    amount: "dot",
    twoDigitYearCentury: 2000,
  },
};

// Create a valid JWT using the same HS256 algorithm as the Backend.
async function createToken() {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(jwtSecret));
}

// Create a minimal Express app for endpoint testing.
function createTestApp() {
  const app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use("/api/analyses", analysisRouter);
  app.use(errorHandler);

  return app;
}

describe("POST /api/analyses/validate", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = jwtSecret;
    vi.resetAllMocks();
  });

  // Reject requests without a JWT.
  it("returns 401 without authentication", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post("/api/analyses/validate")
      .send(validBody);

    expect(response.status).toBe(401);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject an invalid request structure.
  it("returns 400 for invalid input", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({ rows: "invalid" });

    expect(response.status).toBe(400);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject a dataset exceeding the row limit.
  it("returns 413 for too many rows", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        rows: Array.from({ length: 50_001 }, () => ({})),
      });

    expect(response.status).toBe(413);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Return prepared data for an authorized valid request.
  it("returns 200 with validation results", async () => {
    const app = createTestApp();
    const token = await createToken();

    const expected = {
      result: { preparedRows: [] },
      metrics: { computationMs: 2.5 },
    };

    vi.mocked(prepareDataset).mockReturnValue(expected);

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send(validBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
    expect(prepareDataset).toHaveBeenCalledWith(validBody);
  });

  // Never expose internal calculation errors to the client.
  it("returns 500 for unexpected service errors", async () => {
    const app = createTestApp();
    const token = await createToken();

    vi.mocked(prepareDataset).mockImplementation(() => {
      throw new Error("Internal calculation failure");
    });

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send(validBody);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal server error",
    });
  });

  // Reject an empty dataset before calling the service.
  it("returns 400 for an empty dataset", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validBody, rows: [] });

    expect(response.status).toBe(400);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject a date format not supported by analytics-core.
  it("returns 400 for an unsupported date format", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        formats: { ...validBody.formats, date: "INVALID" },
      });

    expect(response.status).toBe(400);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject an unsupported amount format.
  it("returns 400 for an unsupported amount format", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        formats: { ...validBody.formats, amount: "INVALID" },
      });

    expect(response.status).toBe(400);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject an invalid two-digit year setting.
  it("returns 400 for an invalid century", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        formats: {
          ...validBody.formats,
          twoDigitYearCentury: "invalid",
        },
      });

    expect(response.status).toBe(400);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject row properties that are not declared CSV columns.
  it("returns 400 for unknown row columns", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        rows: [{ Date: "2026-01-01", Sales: "100", Unknown: "value" }],
      });

    expect(response.status).toBe(400);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Reject HTTP request bodies larger than the configured JSON limit.
  it("returns 413 when JSON body exceeds 10 MB", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        rows: [
          {
            Date: "2026-01-01",
            Sales: "100",
            Extra: "x".repeat(11 * 1024 * 1024),
          },
        ],
      });

    expect(response.status).toBe(413);
    expect(prepareDataset).not.toHaveBeenCalled();
  });

  // Accept a valid century supported by analytics-core.
  it("accepts a supported two-digit year century", async () => {
    const app = createTestApp();
    const token = await createToken();

    vi.mocked(prepareDataset).mockReturnValue({
      result: { preparedRows: [] },
      metrics: { computationMs: 1 },
    });

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validBody,
        formats: {
          ...validBody.formats,
          twoDigitYearCentury: 1800,
        },
      });

    expect(response.status).toBe(200);
    expect(prepareDataset).toHaveBeenCalledOnce();
  });

  // Reject malformed JSON before it reaches the controller.
  it("returns 400 for malformed JSON", async () => {
    const app = createTestApp();
    const token = await createToken();

    const response = await request(app)
      .post("/api/analyses/validate")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send('{"rows": [invalid JSON}');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid JSON request body");
    expect(prepareDataset).not.toHaveBeenCalled();
  });
});
