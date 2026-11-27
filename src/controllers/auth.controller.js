import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";

// Register a new user and return an authentication token.
// POST /api/auth/register
export async function register(req, res, next) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid registration data",
    });
  }

  try {
    const { email, password } = result.data;
    const data = await authService.register(email, password);

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

// Authenticate a user and return an authentication token.
// POST /api/auth/login
export async function login(req, res, next) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid login data",
    });
  }

  try {
    const { email, password } = result.data;
    const data = await authService.login(email, password);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

// Return the authenticated user's profile.
// GET /api/auth/me
export async function getMe(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.userId);

    if (!user) {
      return res.status(401).json({
        error: "User no longer exists",
      });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}
