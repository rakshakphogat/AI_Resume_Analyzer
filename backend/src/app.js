import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import { startServer } from "./server.js";

startServer();
const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://ai-resume-analyzer-ukv4.vercel.app']

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/uploads", express.static("src/uploads"));

app.get("/", (_req, res) => {
    res.status(200).json({ status: "ok", message: "API WORKING" });
});
app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
