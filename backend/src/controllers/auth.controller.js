import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { comparePassword, hashPassword, signToken } from "../utils/auth.js";

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
    const user = await User.create({ name, email, password: hashed });

    const token = signToken({ userId: user._id, email: user.email });

    res.status(201).json({
        message: "Signup successful",
        token,
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

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken({ userId: user._id, email: user.email });

    res.status(200).json({
        message: "Login successful",
        token,
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
