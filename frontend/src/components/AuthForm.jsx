import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AuthForm = ({
  mode,
  values,
  onChange,
  onSubmit,
  isLoading,
  error,
  extraContent,
}) => {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-sky-200/60 bg-white/90 p-8 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-ink dark:text-slate-100">
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        {isLogin
          ? "Sign in to analyze your resumes"
          : "Start optimizing resumes with AI"}
      </p>

      <form className="space-y-4" onSubmit={onSubmit}>
        {!isLogin && (
          <div>
            <label className="mb-1 block text-sm font-semibold">Name</label>
            <input
              name="name"
              value={values.name}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-sky-300 transition focus:ring dark:border-slate-600 dark:bg-slate-800"
              placeholder="John Doe"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-sky-300 transition focus:ring dark:border-slate-600 dark:bg-slate-800"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-semibold">Password</label>
            {isLogin && (
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-sky-600 dark:text-sky-400"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={onChange}
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 outline-none ring-sky-300 transition focus:ring dark:border-slate-600 dark:bg-slate-800"
              placeholder="******"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Please wait..." : isLogin ? "Login" : "Signup"}
        </button>
      </form>

      {extraContent ? <div className="mt-5">{extraContent}</div> : null}

      <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        {isLogin ? "Need an account? " : "Already have an account? "}
        <Link
          className="font-bold text-sky-600 dark:text-sky-400"
          to={isLogin ? "/signup" : "/login"}
        >
          {isLogin ? "Signup" : "Login"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
