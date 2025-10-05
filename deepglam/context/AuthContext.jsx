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
        console.log("✅ Token loaded from localStorage:", t.substring(0, 20) + "...");
        setToken(t);
        axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      } else {
        console.warn("⚠️ No token found in localStorage on mount");
      }
      
      if (u) {
        setUser(JSON.parse(u));
        console.log("✅ User loaded:", JSON.parse(u).name || JSON.parse(u).email);
      }
    } catch (err) {
      console.error("❌ Error loading auth data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ token, user }) => {
    console.log("🔐 Login called with:", { token: token?.substring(0, 20) + "...", user: user?.name || user?.email });
    
    // persist
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    // set state
    setToken(token);
    setUser(user);

    // set default Authorization for all axios calls
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    console.log("✅ Token saved and axios header set");
  };

  const logout = () => {
    console.log("🚪 Logout called");
    try { apiLogout?.(); } catch {}
    
    // clear axios header + storage + state
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("sellerId");
    localStorage.removeItem("role");
    
    setUser(null);
    setToken(null);
    
    router.push("/login");
    console.log("✅ Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
