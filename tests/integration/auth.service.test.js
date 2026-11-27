import { beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import argon2 from "argon2";
import { UniqueConstraintError } from "sequelize";

// Mock the Sequelize User model before importing the service.
vi.mock("../../models/index.js", () => ({
  User: {
    create: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
  },
}));

import { User } from "../../models/index.js";
import {
  register,
  login,
  getCurrentUser,
} from "../../src/services/auth.service.js";

const originalJwtSecret = process.env.JWT_SECRET;

const testUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "user@example.com",
  password_hash: "stored-hash",
};

describe("Auth service", () => {
  // Reset mocks and configure JWT before each test.
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret-at-least-32-characters-long";
  });

  // Restore the original JWT configuration after tests.
  afterAll(() => {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  });

  // Register a user and return an authentication token.
  it("registers a new user", async () => {
    User.create.mockResolvedValue(testUser);

    const result = await register("user@example.com", "password123");

    expect(User.create).toHaveBeenCalledOnce();
    expect(result.user).toEqual({
      id: testUser.id,
      email: testUser.email,
    });
    expect(result.token).toEqual(expect.any(String));
  });

  // Reject login when the user does not exist.
  it("rejects login for an unknown user", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      login("unknown@example.com", "password123"),
    ).rejects.toMatchObject({
      status: 401,
    });
  });

  // Reject login when the password is incorrect.
  it("rejects login with an invalid password", async () => {
    const passwordHash = await argon2.hash("correct-password");

    User.findOne.mockResolvedValue({
      ...testUser,
      password_hash: passwordHash,
    });

    await expect(
      login("user@example.com", "wrong-password"),
    ).rejects.toMatchObject({
      status: 401,
    });
  });

  // Return the authenticated user's profile.
  it("returns the current user", async () => {
    User.findByPk.mockResolvedValue(testUser);

    const result = await getCurrentUser(testUser.id);

    expect(result).toEqual(testUser);
    expect(User.findByPk).toHaveBeenCalledWith(testUser.id, {
      attributes: ["id", "email"],
    });
  });

  // Return null when the user no longer exists.
  it("returns null for a missing user", async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await getCurrentUser(testUser.id);

    expect(result).toBeNull();
  });

  // Authenticate a user with valid credentials.
  it("logs in with valid credentials", async () => {
    const password = "password123";
    const passwordHash = await argon2.hash(password);

    User.findOne.mockResolvedValue({
      ...testUser,
      password_hash: passwordHash,
    });

    const result = await login("user@example.com", password);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "user@example.com" },
    });

    expect(result.user).toEqual({
      id: testUser.id,
      email: testUser.email,
    });

    expect(result.token).toEqual(expect.any(String));
  });

  // Hash the password before saving a new user.
  it("hashes the password during registration", async () => {
    User.create.mockResolvedValue(testUser);

    await register("user@example.com", "password123");

    const createdData = User.create.mock.calls[0][0];

    expect(createdData.email).toBe("user@example.com");
    expect(createdData.password_hash).not.toBe("password123");

    expect(await argon2.verify(createdData.password_hash, "password123")).toBe(
      true,
    );
  });

  // Return a conflict error when email is already registered.
  it("rejects registration with a duplicate email", async () => {
    User.create.mockRejectedValue(
      new UniqueConstraintError({
        message: "Email already exists",
        errors: [],
      }),
    );

    await expect(
      register("user@example.com", "password123"),
    ).rejects.toMatchObject({
      status: 409,
      message: "Email is already registered",
    });
  });
});
