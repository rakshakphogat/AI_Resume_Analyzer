import { createContext, useContext, useMemo, useState } from "react";

import api from "../services/api";
import { tokenStorage, userStorage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => userStorage.get());
  const [token, setToken] = useState(() => tokenStorage.get());

  const persistAuth = (nextToken, nextUser) => {
    tokenStorage.set(nextToken);
    userStorage.set(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    persistAuth(data.token, data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistAuth(data.token, data.user);
  };

  const logout = () => {
    tokenStorage.remove();
    userStorage.remove();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      signup,
      login,
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
