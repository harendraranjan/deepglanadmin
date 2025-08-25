"use client";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600"
      >
        Logout
      </button>
    </header>
  );
}
