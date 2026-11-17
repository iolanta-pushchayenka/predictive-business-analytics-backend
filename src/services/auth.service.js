import argon2 from "argon2";
import { SignJWT } from "jose";
import { UniqueConstraintError } from "sequelize";
import { User } from "../../models/index.js";

function publicUser(user) {
return {
        id: user.id,
        email: user.email
    };
}

async function createToken(user) {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error ("JWT_SECRET is not configured securely");
    }

    return new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(user.id)
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN || "2h")
        .sign(new TextEncoder().encode(secret));
}

export async function register(email, password) {
const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id
    });

    let user;

    try {
        user = await User.create ({
            email,
            password_hash: passwordHash
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            const conflict = new Error("Email is already registered");
            conflict.status = 409;
            throw conflict;
    }
    throw error;
}

return {
        user: publicUser(user),
        token: await createToken(user)
    };
}


export async function login(email, password) {
    const user = await User.findOne({
        where: { email }
    });

    const validPassword = user
        ? await argon2.verify(user.password_hash, password)
        : false;

    if (!user || !validPassword) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    return {
        user: publicUser(user),
        token: await createToken(user)
    };
}


export async function getCurrentUser(userId) {
    const user = await User.findByPk(userId, {
        attributes: ["id", "email"]
    });

    return user;
}
