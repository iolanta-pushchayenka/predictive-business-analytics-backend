import { jwtVerify } from "jose";

export async function requireAuth(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication token is required"
        });
    }

    const token = authorization.slice(7);

    if (!token) {
        return res.status(401).json({
            error: "Authentication token is required"
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        return next(new Error("JWT_SECRET is not configured securely"));
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
            {
                algorithms: ["HS256"]
            }
        );

        if (typeof payload.sub !== "string" || !payload.sub) {
            return res.status(401).json({
                error: "Invalid authentication token"
            });
        }

        req.userId = payload.sub;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired authentication token"
        });
    }
}
