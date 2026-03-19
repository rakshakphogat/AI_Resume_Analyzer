import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [values, setValues] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const onChange = (event) => {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const onGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google login did not return a credential token.");
      return;
    }

    try {
      setError("");
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(values);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-aurora-light px-4 py-8 dark:bg-aurora-dark">
      <div className="pointer-events-none absolute inset-0 bg-noise-soft opacity-60 dark:opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/20" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/20" />

      <div className="relative w-full">
        <AuthForm
          mode="login"
          values={values}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          extraContent={
            googleEnabled ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
                  Or continue with
                  <span className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => setError("Google login failed")}
                  />
                </div>
              </div>
            ) : null
          }
        />
      </div>
    </main>
  );
};

export default LoginPage;
