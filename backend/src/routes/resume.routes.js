import { Router } from "express";

import {
    createCoverLetter,
    createInterviewQuestions,
    downloadFeedbackReport,
    getAnalysisPromptExample,
    getResumeById,
    listMyResumes,
    recommendProjects,
    rewriteBullets,
    uploadAndAnalyzeResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/prompt-example", protect, getAnalysisPromptExample);
router.get("/", protect, listMyResumes);
router.get("/:id", protect, getResumeById);
router.get("/:id/report", protect, downloadFeedbackReport);
router.post("/:id/cover-letter", protect, createCoverLetter);
router.post("/:id/interview-questions", protect, createInterviewQuestions);
router.post("/:id/missing-projects", protect, recommendProjects);
router.post("/:id/rewrite-bullets", protect, rewriteBullets);
router.post("/upload", protect, uploadResume.single("resume"), uploadAndAnalyzeResume);

export default router;
