import { OAuth2Client } from "google-auth-library";

import { env } from "../config/env.js";
import User from "../models/User.js";
import { sendResetPasswordEmail } from "../services/mail.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    comparePassword,
    createPasswordResetToken,
    hashPassword,
    hashResetToken,
    signToken,
} from "../utils/auth.js";

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

// Cookie options for JWT token
const getCookieOptions = () => ({
    httpOnly: true,
    secure: env.NODE_ENV === "production", // Only use secure cookies in production
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "name, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, authProvider: "local" });

    const token = signToken({ userId: user._id, email: user.email });

    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
        message: "Signup successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!user.password) {
        throw new ApiError(400, "This account uses Google login. Please continue with Google.");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken({ userId: user._id, email: user.email });

    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
});

export const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("name email createdAt");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        // Return success message to avoid user enumeration.
        return res.status(200).json({
            message: "If an account exists for that email, a reset link has been sent.",
        });
    }

    const { rawToken, hashedToken } = createPasswordResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(
        Date.now() + env.RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000
    );
    await user.save();

    const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendResetPasswordEmail({ to: user.email, name: user.name, resetUrl });

    return res.status(200).json({
        message: "If an account exists for that email, a reset link has been sent.",
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        throw new ApiError(400, "Token and new password are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    user.password = await hashPassword(password);
    user.authProvider = "local";
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Logout successful" });
});

export const googleLogin = asyncHandler(async (req, res) => {
    if (!googleClient || !env.GOOGLE_CLIENT_ID) {
        throw new ApiError(500, "Google login is not configured on the server");
    }

    const { idToken } = req.body;
    if (!idToken) {
        throw new ApiError(400, "Google idToken is required");
    }

    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
        throw new ApiError(400, "Invalid Google token payload");
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
        user = await User.create({
            name: payload.name || payload.email.split("@")[0],
            email: payload.email.toLowerCase(),
            authProvider: "google",
            googleId: payload.sub,
        });
    } else if (!user.googleId) {
        user.googleId = payload.sub;
        user.authProvider = "google";
        await user.save();
    }

    const token = signToken({ userId: user._id, email: user.email });

    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
        message: "Google login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
});
