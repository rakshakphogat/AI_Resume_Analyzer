import { MoonStar, Sun } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../utils/useTheme";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-aurora-light px-4 py-8 dark:bg-aurora-dark md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-noise-soft opacity-60 dark:opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/20" />
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/20" />

      <div className="relative mx-auto max-w-6xl fade-in">
        <header className="mb-6 rounded-2xl border border-sky-200/60 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-ink dark:text-slate-100">
                AI Resume Analyzer
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Welcome, {user?.name || "User"}. Optimize your resume for ATS
                and recruiters.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span className="inline-flex items-center gap-2">
                  {theme === "dark" ? (
                    <Sun size={16} />
                  ) : (
                    <MoonStar size={16} />
                  )}
                  {theme === "dark" ? "Light" : "Dark"} Mode
                </span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-sky-500 dark:hover:bg-sky-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
