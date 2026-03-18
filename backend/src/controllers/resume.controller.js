import fs from "fs/promises";

import Resume from "../models/Resume.js";
import { analyzeResumeText, getResumeAnalysisPromptExample } from "../services/aiAnalysis.service.js";
import { extractTextFromResume } from "../services/parseResume.service.js";
import { uploadFileIfNeeded } from "../services/storage.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadAndAnalyzeResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Resume file is required");
    }

    const targetRole = (req.body.targetRole || "").trim();
    const extractedText = await extractTextFromResume(req.file.path, req.file.mimetype);

    if (!extractedText || extractedText.length < 30) {
        throw new ApiError(400, "Could not extract sufficient text from resume");
    }

    const storage = await uploadFileIfNeeded(req.file.path);
    const analysis = await analyzeResumeText(extractedText, targetRole);

    const resumeDoc = await Resume.create({
        userId: req.user.id,
        fileName: req.file.originalname,
        filePath: storage.url,
        mimeType: req.file.mimetype,
        extractedText,
        targetRole,
        skills: analysis.skills || [],
        missingSkills: analysis.missingSkills || [],
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        atsScore: Number(analysis.atsScore || 0),
        suggestions: analysis.suggestions || [],
        rawAnalysis: analysis,
    });

    // Delete local file after cloud upload if using cloud storage.
    if (storage.storage === "cloudinary") {
        await fs.unlink(req.file.path).catch(() => undefined);
    }

    res.status(201).json({
        message: "Resume uploaded and analyzed",
        data: resumeDoc,
    });
});

export const listMyResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.status(200).json({ data: resumes });
});

export const getResumeById = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    res.status(200).json({ data: resume });
});

export const downloadFeedbackReport = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    const reportLines = [
        `AI Resume Analyzer Report`,
        `File: ${resume.fileName}`,
        `Uploaded: ${new Date(resume.uploadedAt).toISOString()}`,
        `ATS Score: ${resume.atsScore}/100`,
        ``,
        `Detected Skills: ${resume.skills.join(", ") || "N/A"}`,
        `Missing Skills: ${resume.missingSkills.join(", ") || "N/A"}`,
        ``,
        `Strengths:`,
        ...resume.strengths.map((item) => `- ${item}`),
        ``,
        `Weaknesses:`,
        ...resume.weaknesses.map((item) => `- ${item}`),
        ``,
        `Suggestions:`,
        ...resume.suggestions.map((s) => `- [${s.category}] ${s.message}`),
    ];

    const content = reportLines.join("\n");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=resume-report-${resume._id}.txt`);
    res.status(200).send(content);
});

export const getAnalysisPromptExample = asyncHandler(async (_req, res) => {
    res.status(200).json({ prompt: getResumeAnalysisPromptExample() });
});
