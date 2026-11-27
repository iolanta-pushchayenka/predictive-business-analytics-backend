import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the auth service without accessing PostgreSQL.
vi.mock("../../src/services/auth.service.js", () => ({
  register: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import * as authService from "../../src/services/auth.service.js";
import {
  register,
  login,
  getMe,
} from "../../src/controllers/auth.controller.js";

// Create mock Express response and next objects.
function createMockContext(body = {}, userId = undefined) {
  const req = { body, userId };

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  const next = vi.fn();

  return { req, res, next };
}

const testUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "user@example.com",
};

describe("Auth controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Return 201 for successful registration.
  it("registers a user successfully", async () => {
    const { req, res, next } = createMockContext({
      email: "user@example.com",
      password: "password123",
    });

    authService.register.mockResolvedValue({
      user: testUser,
      token: "test-token",
    });

    await register(req, res, next);

    expect(authService.register).toHaveBeenCalledWith(
      "user@example.com",
      "password123",
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: testUser,
      token: "test-token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Reject invalid registration data.
  it("returns 400 for invalid registration", async () => {
    const { req, res, next } = createMockContext({
      email: "invalid",
      password: "123",
    });

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.register).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  // Pass registration errors to the global error handler.
  it("forwards registration errors", async () => {
    const { req, res, next } = createMockContext({
      email: "user@example.com",
      password: "password123",
    });

    const error = new Error("Email is already registered");
    error.status = 409;

    authService.register.mockRejectedValue(error);

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // Return 200 for successful login.
  it("logs in successfully", async () => {
    const { req, res, next } = createMockContext({
      email: "user@example.com",
      password: "password123",
    });

    authService.login.mockResolvedValue({
      user: testUser,
      token: "test-token",
    });

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: testUser,
      token: "test-token",
    });
  });

  // Reject invalid login data.
  it("returns 400 for invalid login", async () => {
    const { req, res, next } = createMockContext({
      email: "not-an-email",
      password: "123",
    });

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(authService.login).not.toHaveBeenCalled();
  });

  // Pass login errors to the global error handler.
  it("forwards login errors", async () => {
    const { req, res, next } = createMockContext({
      email: "user@example.com",
      password: "password123",
    });

    const error = new Error("Invalid email or password");
    error.status = 401;

    authService.login.mockRejectedValue(error);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  // Return the authenticated user's profile.
  it("returns the current user", async () => {
    const { req, res, next } = createMockContext({}, testUser.id);

    authService.getCurrentUser.mockResolvedValue(testUser);

    await getMe(req, res, next);

    expect(authService.getCurrentUser).toHaveBeenCalledWith(testUser.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(testUser);
  });

  // Reject access when the user no longer exists.
  it("returns 401 when the user is missing", async () => {
    const { req, res, next } = createMockContext({}, testUser.id);

    authService.getCurrentUser.mockResolvedValue(null);

    await getMe(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Forward unexpected profile lookup errors.
  it("forwards profile lookup errors", async () => {
    const { req, res, next } = createMockContext({}, testUser.id);
    const error = new Error("Database unavailable");

    authService.getCurrentUser.mockRejectedValue(error);

    await getMe(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
