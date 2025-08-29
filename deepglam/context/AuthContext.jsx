"use client";
import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logout as apiLogout } from "@/services/authService";

export const AuthContext = createContext();

const COOKIE = "deepglam_auth";

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const row = document.cookie.split("; ").find(p => p.startsWith(name + "="));
  if (!row) return null;
  try { return JSON.parse(decodeURIComponent(row.split("=")[1])); } catch { return null; }
}
function writeCookie(name, val, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(val))}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}
function clearCookie(name) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (Optional) purani localStorage junk hata do to avoid "undefined is not valid JSON"
    try { localStorage.removeItem("user"); localStorage.removeItem("userToken"); } catch {}
    const sess = readCookie(COOKIE);
    if (sess?.token && sess?.user) { setToken(sess.token); setUser(sess.user); }
    setLoading(false);
  }, []);

  const login = useCallback(({ token, user, rememberDays = 7 }) => {
    if (!token || !user) return;
    writeCookie(COOKIE, { token, user }, rememberDays);
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout?.(); } catch {}
    clearCookie(COOKIE);
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated: !!token, login, logout
  }), [user, token, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
