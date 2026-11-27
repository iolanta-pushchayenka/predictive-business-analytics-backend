import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
} from "../../src/validators/auth.schema.js";

describe("Auth validation", () => {
  // Accept valid registration credentials.
  it("accepts valid registration credentials", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  // Normalize email to lowercase.
  it("normalizes email to lowercase", () => {
    const result = registerSchema.parse({
      email: "User@Example.com",
      password: "password123",
    });

    expect(result.email).toBe("user@example.com");
  });

  // Reject passwords shorter than eight characters.
  it("rejects short passwords", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "1234567",
    });

    expect(result.success).toBe(false);
  });

  // Reject emails longer than the database column limit.
  it("rejects emails longer than 255 characters", () => {
    const result = registerSchema.safeParse({
      email: `${"a".repeat(250)}@example.com`,
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  // Apply credential validation to login.
  it("rejects invalid login credentials", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "1234567",
    });

    expect(result.success).toBe(false);
  });
});
