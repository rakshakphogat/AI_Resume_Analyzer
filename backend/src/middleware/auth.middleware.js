import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = { id: decoded.userId, email: decoded.email };
        return next();
    } catch (_err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
