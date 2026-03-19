import nodemailer from "nodemailer";

import { env } from "../config/env.js";

const createTransporter = () => {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
        });
    }

    // Development fallback that does not require SMTP credentials.
    return nodemailer.createTransport({
        streamTransport: true,
        newline: "unix",
        buffer: true,
    });
};

const transporter = createTransporter();

export const sendResetPasswordEmail = async ({ to, name, resetUrl }) => {
    const result = await transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject: "Reset your AI Resume Analyzer password",
        html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin-bottom:8px">Password Reset Request</h2>
        <p>Hello ${name || "there"},</p>
        <p>We received a request to reset your password. Click the button below to continue:</p>
        <p style="margin:18px 0">
          <a href="${resetUrl}" style="background:#0ea5e9;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a>
        </p>
        <p>This link will expire soon for security reasons.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
        text: `Reset your password: ${resetUrl}`,
    });

    return result;
};
