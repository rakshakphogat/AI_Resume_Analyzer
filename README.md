# AI Resume Analyzer (Production-Level MERN Project)

AI Resume Analyzer is a full-stack MERN application where users can sign up, upload resumes (PDF/DOCX), and receive AI-powered ATS feedback, skill gap analysis, and resume improvement suggestions.

## Tech Stack

- MongoDB (Atlas-ready)
- Express.js
- React.js (Vite)
- Node.js
- TailwindCSS
- JWT Authentication
- Groq API (free tier) or OpenAI API
- Multer (file uploads)
- Recharts (score visualization)

## Features

- JWT signup/login authentication with protected routes
- Google login (OAuth ID token flow)
- Forgot password + reset password via Nodemailer
- Resume upload (PDF/DOCX) using Multer
- Resume parsing via `pdf-parse` and `mammoth`
- AI analysis for:
  - Detected skills
  - Missing skills
  - ATS compatibility score
  - Strengths
  - Weaknesses
  - Actionable suggestions
- Cover letter generator from resume + JD with selectable tone and length
- Interview question generator (technical + behavioral)
- Missing project recommender based on role and skill gaps
- AI bullet point rewriter to STAR format
- Resume history tracking
- Skill gap analysis with optional target role
- Downloadable AI feedback report
- Dark/light mode
- Responsive dashboard UI with drag-and-drop upload and ATS chart

## Project Structure

```text
AI Resume Analyzer/
  backend/
    src/
      app.js
      server.js
      config/
        env.js
      controllers/
        auth.controller.js
        resume.controller.js
      middleware/
        auth.middleware.js
        error.middleware.js
        upload.middleware.js
      models/
        User.js
        Resume.js
      routes/
        auth.routes.js
        resume.routes.js
      services/
        aiAnalysis.service.js
        parseResume.service.js
        storage.service.js
      utils/
        ApiError.js
        asyncHandler.js
        auth.js
      uploads/
        .gitkeep
    .env.example
    package.json
  frontend/
    src/
      App.jsx
      main.jsx
      index.css
      components/
        ATSScoreChart.jsx
        AnalysisPanel.jsx
        AuthForm.jsx
        Layout.jsx
        ProtectedRoute.jsx
        ResumeHistory.jsx
        ResumeUpload.jsx
      context/
        AuthContext.jsx
      pages/
        DashboardPage.jsx
        ForgotPasswordPage.jsx
        LoginPage.jsx
        ResetPasswordPage.jsx
        SignupPage.jsx
      services/
        api.js
      utils/
        storage.js
        useTheme.js
    index.html
    .env.example
    package.json
    tailwind.config.js
    postcss.config.js
    vite.config.js
  README.md
```

## Database Models

### User Model

- `name`
- `email`
- `password`
- `createdAt`

### Resume Model

- `userId`
- `fileName`
- `filePath`
- `mimeType`
- `extractedText`
- `skills`
- `missingSkills`
- `atsScore`
- `strengths`
- `weaknesses`
- `suggestions`
- `uploadedAt`

## Backend API Endpoints

### Auth

- `POST /api/auth/signup` - Create user account
- `POST /api/auth/login` - Login and receive JWT
- `POST /api/auth/google` - Login/signup with Google ID token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password/:token` - Reset password with token
- `GET /api/auth/me` - Get current user profile (protected)

### Resume

- `POST /api/resumes/upload` - Upload and analyze resume (protected)
- `GET /api/resumes` - Get current user resume history (protected)
- `GET /api/resumes/:id` - Get one analysis (protected)
- `GET /api/resumes/:id/report` - Download feedback report text file (protected)
- `POST /api/resumes/:id/cover-letter` - Generate tailored cover letter (protected)
- `POST /api/resumes/:id/interview-questions` - Generate interview questions (protected)
- `POST /api/resumes/:id/missing-projects` - Recommend portfolio projects (protected)
- `POST /api/resumes/:id/rewrite-bullets` - Rewrite bullets into STAR format (protected)
- `GET /api/resumes/prompt-example` - Example OpenAI prompt (protected)

## Example AI Prompt Used

```text
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
```

## Local Development Setup

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` values:

- `MONGO_URI`
- `JWT_SECRET`
- `AI_PROVIDER` (`groq`, `openai`, or `mock`)
- `GROQ_API_KEY` (recommended free option)
- `OPENAI_API_KEY` (optional if using OpenAI)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `GOOGLE_CLIENT_ID`
- Optional Cloudinary vars if `USE_CLOUDINARY=true`

## 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL`, for local dev:

```text
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 3. Run App

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Deployment Guide

## Frontend on Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set root directory to `frontend`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add env var `VITE_API_BASE_URL` pointing to deployed backend API URL.
7. Deploy.

## Backend on Render

1. Create a new Web Service in Render from GitHub repo.
2. Set root directory to `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add environment variables from `backend/.env.example`.
6. Set `CLIENT_URL` to deployed frontend URL.
7. Deploy.

## MongoDB on Atlas

1. Create Atlas cluster.
2. Create DB user and password.
3. Allow Render IPs (or temporarily `0.0.0.0/0` for testing).
4. Get connection string and set as `MONGO_URI` in Render.
5. Restart backend deploy.

## Production Best Practices Included

- Modular backend architecture (controllers/routes/services/middleware)
- Centralized error handling
- Environment variable validation with Zod
- JWT protected routes
- Password hashing with bcryptjs
- Structured OpenAI JSON output handling with fallback behavior
- Frontend auth context + axios interceptor
- Responsive UI with reusable components

## Optional Enhancements

- Add refresh tokens and HTTP-only secure cookie auth flow
- Add unit/integration tests (Jest + Supertest + RTL)
- Add role-based access and admin analytics
- Store reports as PDF and email exports
- Add job description upload for richer matching
