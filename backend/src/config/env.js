import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("5000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 chars"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    AI_PROVIDER: z.enum(["groq", "openai", "mock"]).default("groq"),
    GROQ_API_KEY: z.string().optional(),
    GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default("gpt-4o-mini"),
    CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),
    CLIENT_URLS: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z
        .string()
        .default("587")
        .transform((value) => Number(value)),
    SMTP_SECURE: z
        .string()
        .default("false")
        .transform((value) => value === "true"),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().default("no-reply@ai-resume-analyzer.local"),
    RESET_TOKEN_EXPIRES_MINUTES: z
        .string()
        .default("20")
        .transform((value) => Number(value)),
    GOOGLE_CLIENT_ID: z.string().optional(),
    USE_CLOUDINARY: z
        .string()
        .default("false")
        .transform((value) => value === "true"),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
