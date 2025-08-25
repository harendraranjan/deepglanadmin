// services/authService.js
import api from "./api";

const parseError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

/** POST /auth/login */
export const login = async ({ identifier, password }) => {
  try {
    const { data } = await api.post("/auth/login", { identifier, password });
    const { token, user } = data || {};

    if (token && user) {
      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Logout */
export const logout = async () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  return { ok: true };
};

export default { login, logout };
