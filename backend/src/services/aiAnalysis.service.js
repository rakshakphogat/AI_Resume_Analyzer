import OpenAI from "openai";

import { env } from "../config/env.js";

const getAiClient = () => {
    if (env.AI_PROVIDER === "openai" && env.OPENAI_API_KEY) {
        return {
            client: new OpenAI({ apiKey: env.OPENAI_API_KEY }),
            model: env.OPENAI_MODEL,
        };
    }

    if (env.AI_PROVIDER === "groq" && env.GROQ_API_KEY) {
        return {
            client: new OpenAI({
                apiKey: env.GROQ_API_KEY,
                baseURL: "https://api.groq.com/openai/v1",
            }),
            model: env.GROQ_MODEL,
        };
    }

    return null;
};

const buildPrompt = (resumeText, targetRole = "") => `
You are an expert ATS recruiter and resume coach.
Analyze the following resume text and return strict JSON with this shape:
{
  "skills": string[],
  "missingSkills": string[],
  "atsScore": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": [{"category": string, "message": string}]
}

Rules:
- atsScore must be between 0 and 100.
- skills and missingSkills should be concise.
- suggestions should be specific and actionable.
- If target role is provided, include skill gap analysis based on it.

Target role: ${targetRole || "Not provided"}

Resume text:
${resumeText}
`;

const parseJsonResult = (content) => {
    try {
        return JSON.parse(content);
    } catch (_error) {
        // Try to recover if model wraps the JSON in markdown code fences.
        const cleaned = content.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    }
};

const fallbackAnalysis = (resumeText, targetRole = "") => {
    const hasSections = /(experience|education|skills|projects|summary)/i.test(resumeText);
    const estimatedScore = Math.max(45, Math.min(82, Math.floor(resumeText.length / 60)));

    return {
        skills: ["Communication", "Problem Solving"],
        missingSkills: targetRole ? ["Role-specific tools", "Quantified achievements"] : ["Quantified achievements"],
        atsScore: hasSections ? estimatedScore : 50,
        strengths: ["Contains core resume content", "Readable structure"],
        weaknesses: ["Could include more measurable impact"],
        suggestions: [
            {
                category: "Impact",
                message: "Add metrics to achievements (e.g., improved performance by 20%).",
            },
            {
                category: "Keywords",
                message: targetRole
                    ? `Add more keywords aligned with ${targetRole}.`
                    : "Tailor keywords for each target role.",
            },
        ],
    };
};

export const analyzeResumeText = async (resumeText, targetRole = "") => {
    const provider = getAiClient();

    if (!provider || env.AI_PROVIDER === "mock") {
        return fallbackAnalysis(resumeText, targetRole);
    }

    const completion = await provider.client.chat.completions.create({
        model: provider.model,
        temperature: 0.2,
        messages: [
            {
                role: "system",
                content: "You are a precise resume analyzer. Always return valid JSON only.",
            },
            {
                role: "user",
                content: buildPrompt(resumeText, targetRole),
            },
        ],
        response_format: { type: "json_object" },
    });

    const content = completion.choices?.[0]?.message?.content || "{}";
    return parseJsonResult(content);
};

export const getResumeAnalysisPromptExample = () =>
    buildPrompt(
        "John Doe, software engineer with 4 years in MERN stack, built APIs, improved app load times by 30%...",
        "Backend Engineer"
    );
