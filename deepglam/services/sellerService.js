// services/sellerService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/* ---------- SELLER REGISTRATION ---------- */
export const createSeller = async (payload) => {
  try {
    const { data } = await api.post("/sellers", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- ADMIN MANAGEMENT ---------- */
/**
 * getSellers(params)
 * - params is optional object passed to query params (page, q, filters ...)
 * - returns { ok: true, data } on success
 */
export const getSellers = async (params = {}) => {
  try {
    const { data } = await api.get("/sellers", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// keep `list` as alias for existing code that imports `list as getSellers`
export const list = getSellers;

export const getSellerById = async (id) => {
  try {
    const { data } = await api.get(`/sellers/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getDisapprovedSellers = async (params = {}) => {
  try {
    const { data } = await api.get("/sellers/disapproved", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const approveSeller = async (sellerId) => {
  try {
    const { data } = await api.patch(`/sellers/${sellerId}/approve`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const rejectSeller = async (id, payload = {}) => {
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

/* ---------- DEFAULT EXPORT (backwards compat) ---------- */
export default {
  // Registration
  create: createSeller,
  createSeller,

  // Admin Management
  list: getSellers,
  getSellers,
  getById: getSellerById,
  getSellerById,
  getDisapproved: getDisapprovedSellers,
  getDisapprovedSellers,
  approve: approveSeller,
  approveSeller,
  reject: rejectSeller,
  rejectSeller,

  // Seller Dashboard
  getMyStats,
};
