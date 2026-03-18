import fs from "fs/promises";
import mammoth from "mammoth";
import pdf from "pdf-parse";

import { ApiError } from "../utils/ApiError.js";

const normalizeWhitespace = (text) =>
    text
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, " ")
        .replace(/[ ]{2,}/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

export const extractTextFromResume = async (filePath, mimeType) => {
    const buffer = await fs.readFile(filePath);

    if (mimeType === "application/pdf") {
        const parsed = await pdf(buffer);
        return normalizeWhitespace(parsed.text || "");
    }

    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ buffer });
        return normalizeWhitespace(result.value || "");
    }

    throw new ApiError(400, "Unsupported file type");
};
