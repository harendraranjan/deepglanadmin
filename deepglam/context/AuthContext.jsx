"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { logout as apiLogout } from "@/services/authService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from localStorage on mount and set axios header
  useEffect(() => {
    try {
      const t = localStorage.getItem("userToken");
      const u = localStorage.getItem("user");
      if (t) {
        setToken(t);
        axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      }
      if (u) {
        setUser(JSON.parse(u));
      }
    } catch {
      // ignore bad JSON silently
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ token, user }) => {
    // persist
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    // set state
    setToken(token);
    setUser(user);

    // set default Authorization for all axios calls
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    try { apiLogout?.(); } catch {}
    // clear axios header + storage + state
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
