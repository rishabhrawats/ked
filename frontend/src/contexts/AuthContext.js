import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const data = await api("/auth/login", {
          method: "POST",
          body: { email, password },
        });
        setUser(data.user);
        return data.user;
      },
      async register(payload) {
        return api("/auth/register", { method: "POST", body: payload });
      },
      async logout() {
        await api("/auth/logout", { method: "POST" });
        setUser(null);
      },
      async refresh() {
        const data = await api("/auth/me");
        setUser(data.user);
        return data.user;
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
