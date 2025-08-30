// services/authService.js
import api from "./api";
import axios from "axios";

/* ---------------- helpers ---------------- */
const parseErr = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

const normEmail = (e) => (e ? String(e).trim().toLowerCase() : "");

/**
 * Accepts either:
 *  A) { role, buyer|seller|staff|admin }
 *  B) { user: { role, _id, name, email, phone, sellerId/buyerId/staffId } }
 */
const buildUser = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  // --- Shape A: { role, buyer|seller|staff|admin } ---
  const roleA = raw.role;
  const entityA = raw.buyer || raw.seller || raw.staff || raw.admin;
  if (roleA && entityA) {
    const idA = entityA._id || entityA.id;
    return idA
      ? {
          role: roleA,
          id: idA,
          name: entityA.name || entityA.fullName || entityA.brandName || "User",
          email: entityA.email || null,
          phone: entityA.phone || entityA.mobile || null,
          profile: entityA,
        }
      : null;
  }

  // --- Shape B: { user: {...} }  (your seller response) ---
  const u = raw.user;
  if (u && u.role) {
    // prefer role-specific ids if present
    const roleId = u.sellerId || u.buyerId || u.staffId || null;
    const id = roleId || u._id || u.id || null;

    // Build a lightweight profile so UI can access flags like isApproved
    const profile = {
      _id: id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      brandName: u.brandName,
      isApproved: u.isApproved,
      sellerId: u.sellerId,
      buyerId: u.buyerId,
      staffId: u.staffId,
      role: u.role,
    };

    return id
      ? {
          role: u.role,
          id,
          name: u.name || u.brandName || "User",
          email: u.email || null,
          phone: u.phone || null,
          profile,
        }
      : null;
  }

  return null;
};

/* ---------------- API ---------------- */
export const login = async ({ email, password }) => {
  try {
    const payload = { email: normEmail(email), password };
    // use your configured baseURL
    const resp = await api.post("/auth/login", payload);

    const data = resp?.data || {};
    const token = data?.token;
    const user = buildUser(data);

    if (!token) return { ok: false, error: "Invalid server response (missing token)." };
    if (!user)  return { ok: false, error: "Invalid server response (missing user)." };

    // persist for web
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    // prime auth headers
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (api?.defaults?.headers) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return { ok: true, data: { token, user } };
  } catch (err) {
    return { ok: false, error: parseErr(err) };
  }
};

export const logout = async () => {
  try {
    delete axios.defaults.headers.common["Authorization"];
    if (api?.defaults?.headers?.common?.Authorization) {
      delete api.defaults.headers.common["Authorization"];
    }
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
  } catch {}
  return { ok: true };
};

export default { login, logout };
