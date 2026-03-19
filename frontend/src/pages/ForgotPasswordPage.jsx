import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const responseMessage = await forgotPassword(email);
      setMessage(
        responseMessage || "If your account exists, we have sent a reset link.",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-aurora-light px-4 py-8 dark:bg-aurora-dark">
      <div className="pointer-events-none absolute inset-0 bg-noise-soft opacity-60 dark:opacity-30" />
      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-sky-200/60 bg-white/90 p-8 shadow-soft backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <h1 className="mb-2 font-display text-2xl font-extrabold text-ink dark:text-slate-100">
          Forgot Password
        </h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
          Enter your email and we will send you a reset link.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-sky-300 transition focus:ring dark:border-slate-600 dark:bg-slate-800"
              placeholder="john@example.com"
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
            {isLoading ? "Sending..." : "Send reset link"}
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

export default ForgotPasswordPage;
