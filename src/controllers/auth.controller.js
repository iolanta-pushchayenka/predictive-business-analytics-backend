
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";

export async function register(req, res) {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Invalid registration data"
        });
    }

    try {
        const { email, password } = result.data;
        const data = await authService.register(email, password);

        return res.status(201).json(data);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status ? error.message : "Internal server error"
        });
    }
}

export async function login(req, res) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Invalid login data"
        });
    }

    try {
        const { email, password } = result.data;
        const data = await authService.login(email, password);

        return res.status(200).json(data);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status ? error.message : "Internal server error"
        });
    }
}



export async function getMe(req, res) {
    try {
        const user = await authService.getCurrentUser(req.userId);

        if (!user) {
            return res.status(401).json({
                error: "User no longer exists"
            });
        }

        return res.status(200).json({
            id: user.id,
            email: user.email
        });
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
