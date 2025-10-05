// services/userService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/* ================================
   🧑‍💼 USER CRUD & PROFILE METHODS
   ================================ */

/** 
 * Get User by ID
 * GET /users/:id 
 */
export const getById = async (id) => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Get Logged-in User Profile
 * GET /users/profile
 * (Fixes missing getProfile export)
 */
export const getProfile = async () => {
  try {
    const { data } = await api.get("/users/profile");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Update User Profile
 * PUT /users/:id
 */
export const updateProfile = async (id, payload) => {
  try {
    const { data } = await api.put(`/users/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ================================
   🧩 ADMIN & STAFF USER MANAGEMENT
   ================================ */

/**
 * Get all users (Admin use)
 * GET /users
 */
export const getAllUsers = async (params = {}) => {
  try {
    const { data } = await api.get("/users", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Update user role (Admin)
 * PATCH /users/:id/role
 */
export const updateUserRole = async (id, role) => {
  try {
    const { data } = await api.patch(`/users/${id}/role`, { role });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Get buyers assigned to a staff member by code
 * GET /users/staff/:code
 */
export const getBuyersByStaffCode = async (code, params = {}) => {
  try {
    const { data } = await api.get(`/users/staff/${code}`, { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * List buyers (Admin)
 * GET /users?type=buyer
 */
export const listBuyers = async (params = {}) => {
  try {
    const { data } = await api.get("/users", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Approve a buyer (Admin)
 * PUT /users/approve/:id
 */
export const approveBuyer = async (id) => {
  try {
    const { data } = await api.put(`/users/approve/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Reject a buyer (Admin)
 * PUT /users/reject/:id
 */
export const rejectBuyer = async (id, payload = {}) => {
  try {
    const { data } = await api.put(`/users/reject/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ================================
   ✅ DEFAULT EXPORT
   ================================ */
export default {
  getById,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  getBuyersByStaffCode,
  listBuyers,
  approveBuyer,
  rejectBuyer,
};
