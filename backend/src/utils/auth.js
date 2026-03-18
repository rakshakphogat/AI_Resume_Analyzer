import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

export const signToken = (payload) =>
    jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
