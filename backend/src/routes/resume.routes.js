import { Router } from "express";

import {
    downloadFeedbackReport,
    getAnalysisPromptExample,
    getResumeById,
    listMyResumes,
    uploadAndAnalyzeResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/prompt-example", protect, getAnalysisPromptExample);
router.get("/", protect, listMyResumes);
router.get("/:id", protect, getResumeById);
router.get("/:id/report", protect, downloadFeedbackReport);
router.post("/upload", protect, uploadResume.single("resume"), uploadAndAnalyzeResume);

export default router;
