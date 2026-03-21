import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Sparkles,
    title: "AI Resume Analysis",
    description:
      "Get ATS score, strengths, weaknesses, and focused suggestions instantly.",
  },
  {
    icon: Target,
    title: "Role-Specific Optimization",
    description:
      "Align your resume to any target role and identify missing skills quickly.",
  },
  {
    icon: FileText,
    title: "Career Toolkit",
    description:
      "Generate cover letters, STAR bullet rewrites, interview questions, and projects.",
  },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-emerald-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
          <h1 className="font-display text-xl font-extrabold text-slate-900 dark:text-slate-100">
            AI Resume Analyzer
          </h1>
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  Signup
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Dashboard
              </Link>
            )}
          </div>
        </header>

        <section className="relative rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 md:p-12">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />

          <div className="relative">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              <Sparkles size={14} />
              Built for Job Seekers
            </p>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 md:text-5xl">
              Build a recruiter-ready resume with AI-backed feedback
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Upload your resume, get ATS insights, uncover missing skills, and
              generate role-specific career assets in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-3 inline-flex rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 dark:border-emerald-800 dark:bg-emerald-900/10">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            Why this helps your job search
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
              Improve ATS visibility with role-matched keywords.
            </li>
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
              Turn weak achievements into quantified, interview-ready bullet
              points.
            </li>
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
              Prepare quickly with targeted interview questions and project
              suggestions.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
