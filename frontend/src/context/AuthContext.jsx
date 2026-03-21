import { createContext, useContext, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const updateAuth = (nextUser) => {
    // Token is now stored in httpOnly cookie, only manage user state
    setUser(nextUser);
    setToken(nextUser ? "authenticated" : null); // Set token to indicate auth state
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    // Token is automatically set in httpOnly cookie by backend
    updateAuth(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    console.log("API", api);
    console.log("REACHED HERE");
    // Token is automatically set in httpOnly cookie by backend
    updateAuth(data.user);
    console.log("DONE");
  };

  const googleLogin = async (idToken) => {
    const { data } = await api.post("/auth/google", { idToken });
    // Token is automatically set in httpOnly cookie by backend
    updateAuth(data.user);
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data.message;
  };

  const resetPassword = async (tokenValue, password) => {
    const { data } = await api.post(`/auth/reset-password/${tokenValue}`, {
      password,
    });
    return data.message;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local state and cookie
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      signup,
      login,
      googleLogin,
      forgotPassword,
      resetPassword,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
