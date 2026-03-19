import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const responseMessage = await resetPassword(token, password);
      setMessage(
        responseMessage || "Password reset successful. Redirecting to login...",
      );
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Reset password failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-aurora-light px-4 py-8 dark:bg-aurora-dark">
      <div className="pointer-events-none absolute inset-0 bg-noise-soft opacity-60 dark:opacity-30" />
      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-sky-200/60 bg-white/90 p-8 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <h1 className="mb-2 font-display text-2xl font-extrabold text-ink dark:text-slate-100">
          Reset Password
        </h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
          Enter your new password below.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-sky-300 transition focus:ring dark:border-slate-600 dark:bg-slate-800"
              placeholder="******"
            />
          </div>

          {message ? (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Back to{" "}
          <Link
            to="/login"
            className="font-bold text-sky-600 dark:text-sky-400"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
