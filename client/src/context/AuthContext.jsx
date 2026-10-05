import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TOKEN_KEY } from "../api/axios";
import { getMeRequest, loginRequest, signupRequest } from "../api/auth.api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }
    getMeRequest()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      queryClient.clear();
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [queryClient]);

  const saveSession = useCallback(
    (data) => {
      queryClient.clear();
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
    },
    [queryClient]
  );

  const login = useCallback(async (credentials) => saveSession(await loginRequest(credentials)), [saveSession]);
  const signup = useCallback(async (details) => saveSession(await signupRequest(details)), [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
