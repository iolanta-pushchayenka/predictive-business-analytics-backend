import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";
import { requireAuth } from "../../src/middlewares/auth.middlewares.js";

const originalJwtSecret = process.env.JWT_SECRET;
const testSecret = "test-secret-at-least-32-characters-long";
const testUserId = "550e8400-e29b-41d4-a716-446655440000";

// Create a signed JWT for middleware testing.
async function createTestToken({
  subject = testUserId,
  expiresIn = "2h",
  secret = testSecret,
  includeExpiration = true,
} = {}) {
  let jwt = new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt();

  if (includeExpiration) {
    jwt = jwt.setExpirationTime(expiresIn);
  }

  return jwt.sign(new TextEncoder().encode(secret));
}

// Create mock Express request, response and next objects.
function createMockContext(authorization) {
  const req = {
    headers: authorization ? { authorization } : {},
  };

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  const next = vi.fn();

  return { req, res, next };
}

describe("Auth middleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = testSecret;
    vi.clearAllMocks();
  });

  // Restore JWT configuration after all tests.
  afterAll(() => {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  });

  // Reject requests without a token.
  it("rejects a missing Authorization header", async () => {
    const { req, res, next } = createMockContext();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Reject an empty bearer token.
  it("rejects an empty Bearer token", async () => {
    const { req, res, next } = createMockContext("Bearer ");

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Reject tokens signed with another secret.
  it("rejects a token with an invalid signature", async () => {
    const token = await createTestToken({
      secret: "another-test-secret-at-least-32-characters",
    });

    const { req, res, next } = createMockContext(`Bearer ${token}`);

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Reject expired authentication tokens.
  it("rejects an expired token", async () => {
    const token = await createTestToken({ expiresIn: "-1h" });

    const { req, res, next } = createMockContext(`Bearer ${token}`);

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Require an expiration claim in JWT.
  it("rejects a token without expiration", async () => {
    const token = await createTestToken({
      includeExpiration: false,
    });

    const { req, res, next } = createMockContext(`Bearer ${token}`);

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Reject tokens with invalid user identifiers.
  it("rejects a token with invalid UUID", async () => {
    const token = await createTestToken({
      subject: "not-a-valid-uuid",
    });

    const { req, res, next } = createMockContext(`Bearer ${token}`);

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Accept a valid JWT and attach the authenticated user ID.
  it("accepts a valid token", async () => {
    const token = await createTestToken();

    const { req, res, next } = createMockContext(`Bearer ${token}`);

    await requireAuth(req, res, next);

    expect(req.userId).toBe(testUserId);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });
});
