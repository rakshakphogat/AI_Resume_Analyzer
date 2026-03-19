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

const safeArray = (value) => (Array.isArray(value) ? value : []);

const callJsonModel = async (systemPrompt, userPrompt, fallback) => {
    const provider = getAiClient();

    if (!provider || env.AI_PROVIDER === "mock") {
        return fallback();
    }

    const completion = await provider.client.chat.completions.create({
        model: provider.model,
        temperature: 0.3,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
    });

    const content = completion.choices?.[0]?.message?.content || "{}";
    return parseJsonResult(content);
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
    return callJsonModel(
        "You are a precise resume analyzer. Always return valid JSON only.",
        buildPrompt(resumeText, targetRole),
        () => fallbackAnalysis(resumeText, targetRole)
    );
};

export const getResumeAnalysisPromptExample = () =>
    buildPrompt(
        "John Doe, software engineer with 4 years in MERN stack, built APIs, improved app load times by 30%...",
        "Backend Engineer"
    );

const fallbackCoverLetter = ({ targetRole, tone, length, jobDescription }) => {
    const compactRole = targetRole || "the role";
    const jdHint = jobDescription
        ? "I am particularly excited about the listed responsibilities and the chance to contribute quickly."
        : "I am excited to contribute my skills and grow with your team.";

    const paragraphs = [
        `Dear Hiring Manager,\n\nI am writing to apply for ${compactRole}. With hands-on experience across modern development workflows, I bring a practical mindset focused on delivering measurable outcomes.`,
        `In previous projects, I have designed and shipped reliable features, collaborated with cross-functional stakeholders, and improved performance through iterative delivery. ${jdHint}`,
        `My communication style is ${tone} and my approach is execution-oriented. I would welcome the opportunity to discuss how I can create impact in this role.\n\nSincerely,\nYour Name`,
    ];

    if (length === "short") {
        return { coverLetter: `${paragraphs[0]}\n\n${paragraphs[2]}` };
    }

    if (length === "long") {
        return {
            coverLetter: `${paragraphs[0]}\n\n${paragraphs[1]}\n\nI also value ownership, clear documentation, and thoughtful collaboration. I consistently adapt quickly to new domains and prioritize customer outcomes in every iteration.\n\n${paragraphs[2]}`,
        };
    }

    return { coverLetter: paragraphs.join("\n\n") };
};

export const generateCoverLetter = async ({ resumeText, targetRole, tone, length, jobDescription }) =>
    callJsonModel(
        "You are an expert career coach. Return JSON only.",
        `Create a tailored cover letter and return JSON: {"coverLetter": string}.
Tone: ${tone}
Length: ${length}
Target role: ${targetRole || "Not provided"}
Job description: ${jobDescription || "Not provided"}
Resume text:\n${resumeText}`,
        () => fallbackCoverLetter({ targetRole, tone, length, jobDescription })
    );

const fallbackInterviewQuestions = ({ role, count = 8 }) => {
    const total = Math.max(4, Math.min(20, Number(count) || 8));
    const half = Math.ceil(total / 2);

    const technical = Array.from({ length: half }, (_, index) =>
        `${index + 1}. For a ${role || "software"} role, explain a recent technical decision and its trade-offs.`
    );
    const behavioral = Array.from({ length: total - half }, (_, index) =>
        `${index + 1}. Describe a challenging collaboration and how you handled it.`
    );

    return { technical, behavioral };
};

export const generateInterviewQuestions = async ({ resumeText, role, count = 8 }) => {
    const response = await callJsonModel(
        "You are a senior interviewer. Return JSON only.",
        `Generate interview questions and return JSON: {"technical": string[], "behavioral": string[]}.
Role: ${role || "Not provided"}
Count requested: ${count}
Resume text:\n${resumeText}`,
        () => fallbackInterviewQuestions({ role, count })
    );

    return {
        technical: safeArray(response.technical),
        behavioral: safeArray(response.behavioral),
    };
};

const fallbackProjectRecommendations = ({ targetRole, missingSkills = [], count = 4 }) => {
    const total = Math.max(2, Math.min(8, Number(count) || 4));
    const pool = missingSkills.length ? missingSkills : ["API design", "Testing", "Deployment"];

    return {
        projects: Array.from({ length: total }, (_, index) => ({
            title: `${targetRole || "Portfolio"} Project ${index + 1}`,
            summary: `Build a production-style app emphasizing ${pool[index % pool.length]} and measurable outcomes.`,
            skillsCovered: [pool[index % pool.length]],
            complexity: index < 2 ? "Intermediate" : "Advanced",
        })),
    };
};

export const generateMissingProjects = async ({ resumeText, targetRole, missingSkills = [], count = 4 }) => {
    const response = await callJsonModel(
        "You are a portfolio mentor. Return JSON only.",
        `Suggest project ideas and return JSON: {"projects": [{"title": string, "summary": string, "skillsCovered": string[], "complexity": "Beginner"|"Intermediate"|"Advanced"}]}
Target role: ${targetRole || "Not provided"}
Missing skills: ${missingSkills.join(", ") || "Not provided"}
Count requested: ${count}
Resume text:\n${resumeText}`,
        () => fallbackProjectRecommendations({ targetRole, missingSkills, count })
    );

    return {
        projects: safeArray(response.projects).map((project) => ({
            title: project?.title || "Suggested Project",
            summary: project?.summary || "Build a role-aligned project with measurable business impact.",
            skillsCovered: safeArray(project?.skillsCovered),
            complexity: project?.complexity || "Intermediate",
        })),
    };
};

const fallbackRewrittenBullets = ({ bullets = [], targetRole }) => ({
    rewrittenBullets: bullets.map((bullet) => ({
        original: bullet,
        rewritten: `Situation: In a prior role, a key workflow needed improvement. Task: Improve it for better outcomes. Action: Applied ${targetRole || "role"}-focused techniques and delivered changes iteratively. Result: Improved reliability, speed, and stakeholder satisfaction with measurable impact.`,
        metricsHint: "Add a numeric result such as time saved, revenue impact, or performance gain.",
    })),
});

export const rewriteExperienceBullets = async ({ bullets = [], targetRole, resumeText }) => {
    const response = await callJsonModel(
        "You are an expert resume writer. Return JSON only.",
        `Rewrite bullets in STAR format with stronger action verbs and quantified impact where possible.
Return JSON: {"rewrittenBullets": [{"original": string, "rewritten": string, "metricsHint": string}]}
Target role: ${targetRole || "Not provided"}
Bullets:\n${bullets.map((item, index) => `${index + 1}. ${item}`).join("\n")}
Resume context:\n${resumeText}`,
        () => fallbackRewrittenBullets({ bullets, targetRole })
    );

    return {
        rewrittenBullets: safeArray(response.rewrittenBullets).map((item, index) => ({
            original: item?.original || bullets[index] || "",
            rewritten: item?.rewritten || bullets[index] || "",
            metricsHint: item?.metricsHint || "Add quantified impact where possible.",
        })),
    };
};
