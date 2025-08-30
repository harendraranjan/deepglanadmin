// services/authService.js
import api from "./api";
import axios from "axios";

const parseErr = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

// Build a unified "user" from { role, buyer | seller | staff | admin }
const buildUser = (raw) => {
  const role = raw?.role;
  const entity =
    raw?.buyer || raw?.seller || raw?.staff || raw?.admin || null;

  if (!role || !entity) return null;

  return {
    role,
    id: entity._id || entity.id,
    name: entity.name || entity.fullName || entity.brandName || "User",
    email: entity.email,
    phone: entity.phone || entity.mobile,
    // Keep the raw role object if you need details in UI later
    profile: entity,
  };
};

export const login = async ({ email, password }) => {
  try {
    const payload = {
      email: String(email || "").trim().toLowerCase(),
      password,
    };

    // Absolute URL to be explicit
    const resp = await api.post(
      "https://deepglam.onrender.com/api/auth/login",
      payload
    );

    const data = resp?.data || {};
    const token = data?.token;
    const user = buildUser(data);

    if (!token) return { ok: false, error: "Invalid server response (missing token)." };
    if (!user)  return { ok: false, error: "Invalid server response (missing user)." };

    // Persist + prime axios
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { ok: true, data: { token, user } };
  } catch (err) {
    return { ok: false, error: parseErr(err) };
  }
};

export const logout = async () => {
  try {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
  } catch {}
  return { ok: true };
};

export default { login, logout };
