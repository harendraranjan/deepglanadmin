// services/api.js
import axios from "axios";

// ✅ Base URL from .env.local
export const BASE_URL = "https://deepglam.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Helper: check if request is to our backend
const isOurApi = (url) => {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  try {
    const u = new URL(url);
    const b = new URL(BASE_URL);
    return u.origin === b.origin;
  } catch {
    return false;
  }
};

// REQUEST interceptor
api.interceptors.request.use(
  (config) => {
    const isFormData =
      config.data instanceof FormData ||
      (config.headers &&
        config.headers["Content-Type"]?.includes("multipart/form-data"));

    if (!isFormData) {
      config.headers["Accept"] = config.headers["Accept"] || "application/json";
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
    }

    if (isOurApi(config.url)) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("userToken")
          : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      if (config.headers?.Authorization) delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const reqUrl = err.config?.url;

    if (status === 401 && isOurApi(reqUrl)) {
      console.log("❌ Unauthorized. Clearing session...");
      localStorage.clear();

      // ✅ Use browser redirect (safe in client)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// Unified error parser
export const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

export default api;
