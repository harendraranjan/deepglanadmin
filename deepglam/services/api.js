// services/api.js
import axios from "axios";

export const BASE_URL ="https://deepglam.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// helper: decide whether to attach token
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

// REQUEST
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

    // attach token (client-side)
    if (isOurApi(config.url)) {
      try {
        const t =
          typeof window !== "undefined"
            ? localStorage.getItem("userToken")
            : null;
        if (t) config.headers.Authorization = `Bearer ${t}`;
        else delete config.headers.Authorization;
      } catch {}
    } else {
      if (config.headers?.Authorization) delete config.headers.Authorization;
    }

    // debug (optional)
    // console.log("[API] →", (config.baseURL || "") + (config.url || ""));
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const reqUrl = err.config?.url;

    if (status === 401 && isOurApi(reqUrl)) {
      console.log("❌ 401 Unauthorized → clearing session");
      try {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
      } catch {}
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

export default api;
