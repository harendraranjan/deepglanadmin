// components/Protected.jsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Protected({ children }) {
  const { token, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600">Checking session…</span>
      </div>
    );
  }
  if (!token) return null; // will redirect

  return children;
}
