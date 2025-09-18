import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/* ---------- SELLER REGISTRATION ---------- */
export const create = async (payload) => {
  try {
    const { data } = await api.post("/sellers", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- ADMIN MANAGEMENT ---------- */
export const list = async (params = {}) => {
  try {
    const { data } = await api.get("/sellers", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getById = async (id) => {
  try {
    const { data } = await api.get(`/sellers/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getDisapproved = async (params = {}) => {
  try {
    const { data } = await api.get("/sellers/disapproved", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const approve = async (sellerId) => {
  try {
    const { data } = await api.patch(`/sellers/${sellerId}/approve`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const reject = async (id, payload = {}) => {
  try {
    const { data } = await api.patch(`/sellers/${id}/reject`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- SELLER DASHBOARD ---------- */
export const getMyStats = async () => {
  try {
    const { data } = await api.get("/sellers/my/stats");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- DEFAULT EXPORT ---------- */
export default {
  // Registration
  create,
  
  // Admin Management
  list,
  getById,
  getDisapproved,
  approve,
  reject,
  
  // Seller Dashboard
  getMyStats,
};