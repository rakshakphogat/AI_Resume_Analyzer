import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [values, setValues] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
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
        />
      </div>
    </main>
  );
};

export default LoginPage;
