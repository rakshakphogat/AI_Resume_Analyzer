import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

export const signToken = (payload) =>
    jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });

export const createPasswordResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hashedToken };
};

export const hashResetToken = (rawToken) =>
    crypto.createHash("sha256").update(rawToken).digest("hex");
