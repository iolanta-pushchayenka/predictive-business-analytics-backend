import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { SignJWT } from "jose";

// Mock authentication services to avoid real database operations.
vi.mock("../../src/services/auth.service.js", () => ({
  register: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import * as authService from "../../src/services/auth.service.js";
import { app } from "../../src/app.js";

const originalJwtSecret = process.env.JWT_SECRET;
const testSecret = "test-secret-at-least-32-characters-long";

const testUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "user@example.com",
};

// Generate a valid JWT for protected API requests.
async function createTestToken() {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(testUser.id)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(testSecret));
}

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = testSecret;
  });

  // Restore JWT configuration after testing.
  afterAll(() => {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  });

  // Register a user using the HTTP API.
  it("returns 201 for successful registration", async () => {
    authService.register.mockResolvedValue({
      user: testUser,
      token: "test-token",
    });

    const response = await request(app).post("/api/auth/register").send({
      email: "user@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: testUser,
      token: "test-token",
    });
  });

  // Reject invalid registration data.
  it("returns 400 for invalid registration data", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(authService.register).not.toHaveBeenCalled();
  });

  // Return a conflict when the email is already registered.
  it("returns 409 for duplicate email", async () => {
    const error = new Error("Email is already registered");
    error.status = 409;

    authService.register.mockRejectedValue(error);

    const response = await request(app).post("/api/auth/register").send({
      email: "user@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: "Email is already registered",
    });
  });

  // Authenticate using the HTTP API.
  it("returns 200 for successful login", async () => {
    authService.login.mockResolvedValue({
      user: testUser,
      token: "test-token",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(testUser);
    expect(response.body.token).toBe("test-token");
  });

  // Return the profile when a valid JWT is provided.
  it("returns 200 for authenticated GET /me", async () => {
    const token = await createTestToken();

    authService.getCurrentUser.mockResolvedValue(testUser);

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(testUser);
    expect(authService.getCurrentUser).toHaveBeenCalledWith(testUser.id);
  });

  // Reject protected requests without a JWT.
  it("returns 401 for GET /me without token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(authService.getCurrentUser).not.toHaveBeenCalled();
  });

  // Return a safe error response when the service fails.
  it("returns 500 for an unexpected service error", async () => {
    authService.login.mockRejectedValue(new Error("Database unavailable"));

    const response = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal server error",
    });
  });
});
