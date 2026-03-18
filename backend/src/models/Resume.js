import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
    {
        category: { type: String, required: true },
        message: { type: String, required: true },
    },
    { _id: false }
);

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        extractedText: {
            type: String,
            required: true,
        },
        targetRole: {
            type: String,
            default: "",
        },
        skills: {
            type: [String],
            default: [],
        },
        missingSkills: {
            type: [String],
            default: [],
        },
        strengths: {
            type: [String],
            default: [],
        },
        weaknesses: {
            type: [String],
            default: [],
        },
        atsScore: {
            type: Number,
            default: 0,
        },
        suggestions: {
            type: [suggestionSchema],
            default: [],
        },
        rawAnalysis: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: { createdAt: false, updatedAt: false },
    }
);

resumeSchema.add({
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
