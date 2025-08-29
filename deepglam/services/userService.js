// services/userService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/** Public (as per routes): GET /users/:id */
export const getById = async (id) => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** PUT /users/:id (update profile) */
export const updateProfile = async (id, payload) => {
  try {
    const { data } = await api.put(`/users/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** Admin: GET /users/staff/:code (buyers under staff code) */
export const getBuyersByStaffCode = async (code, params = {}) => {
  try {
    const { data } = await api.get(`/users/staff/${code}`, { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** Admin: GET /users (all buyers) */
export const listBuyers = async (params = {}) => {
  try {
    const { data } = await api.get("/users", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** Admin: PUT /users/approve/:id */
export const approveBuyer = async (id) => {
  try {
    const { data } = await api.put(`/users/approve/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** Admin: PUT /users/reject/:id */
export const rejectBuyer = async (id, payload = {}) => {
  try {
    const { data } = await api.put(`/users/reject/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export default {
  getById,
  updateProfile,
  getBuyersByStaffCode,
  listBuyers,
  approveBuyer,
  rejectBuyer,
};
