// services/api.js
import axios from "axios";

/** Use same base as the app */
// export const BASE_URL = "https://deepglam.onrender.com/api"; 
export const BASE_URL = "http://192.168.62.239:3001/api"; 

/** Single axios instance */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ---------------- Helpers ---------------- */
const isOurApi = (url) => {
  if (!url) return false;
  if (typeof url === "string" && url.startsWith("/")) return true;
  try {
    const u = new URL(url, BASE_URL);
    const b = new URL(BASE_URL);
    return u.origin === b.origin;
  } catch {
    return false;
  }
};

const getPathname = (url) => {
  try {
    return new URL(url, BASE_URL).pathname || "";
  } catch {
    return (url || "").toString();
  }
};

/** Normalize "/api/products" → "/products" for route checks */
const stripApiBase = (p) => p.replace(/^\/api\/?/, "/");

/* --------------- REQUEST Interceptor --------------- */
api.interceptors.request.use(
  (config) => {
    const isFormData =
      config.data instanceof FormData ||
      (config.headers &&
        String(config.headers["Content-Type"] || "").includes("multipart/form-data"));

    // Default headers for JSON
    if (!isFormData) {
      config.headers["Accept"] = config.headers["Accept"] || "application/json";
      config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
    }

    if (isOurApi(config.url)) {
      // 🔐 Attach JWT (same keys as app)
      try {
        const t = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
        if (t) {
          config.headers.Authorization = `Bearer ${t}`;
          console.log("✅ Token attached:", t.substring(0, 20) + "..."); // Debug log
        } else {
          console.warn("⚠️ No token found in localStorage");
          delete config.headers.Authorization;
        }
      } catch (err) {
        console.error("❌ Error reading token:", err);
        delete config.headers.Authorization;
      }

      // 🔹 Optional parity with app: pass sellerId header if present
      try {
        const sellerId = typeof window !== "undefined" ? localStorage.getItem("sellerId") : null;
        if (sellerId) config.headers["x-seller-id"] = sellerId;

        // Auto-inject sellerId into product write bodies (harmless if backend ignores it)
        const method = (config.method || "get").toLowerCase();
        const path = stripApiBase(getPathname(config.url));
        const isProductsRoute = path.startsWith("/products");

        if (
          sellerId &&
          isProductsRoute &&
          ["post", "put", "patch"].includes(method) &&
          !isFormData &&
          config.data &&
          typeof config.data === "object" &&
          !("sellerId" in config.data)
        ) {
          config.data = { ...config.data, sellerId };
        }
      } catch {
        // ignore
      }
    } else {
      // External calls (e.g., Cloudinary) → strip auth/seller headers
      if (config.headers?.Authorization) delete config.headers.Authorization;
      if (config.headers?.["x-seller-id"]) delete config.headers["x-seller-id"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* --------------- RESPONSE Interceptor --------------- */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const reqUrl = err.config?.url;

    if (status === 401 && isOurApi(reqUrl)) {
      // Token expired/invalid → clear and redirect to login
      console.log("❌ 401 Unauthorized → clearing session");
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("userToken");
          localStorage.removeItem("sellerId");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          window.location.replace("/login");
        }
      } catch {}
    }
    return Promise.reject(err);
  }
);

/* --------------- Error Helper --------------- */
export const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

export default api;
