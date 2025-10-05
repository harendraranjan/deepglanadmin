// services/buyerService.js
import api from "./api";

const parseError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

/* ---------- BUYER CRUD ---------- */
export const createBuyer = async (payload) => {
  try {
    const { data } = await api.post("/buyers", payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Get Buyers (Admin + Staff use)
 * GET /buyers
 */
export const getBuyers = async (params = {}) => {
  try {
    const { data } = await api.get("/buyers", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

export const list = getBuyers; // alias for compatibility

/** 
 * Get Logged-in Buyer's Profile
 * GET /buyers/my
 */
export const getBuyerProfile = async () => {
  try {
    const { data } = await api.get("/buyers/my");
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Get Buyer by ID (Admin use)
 * GET /buyers/:buyerId
 */
export const getById = async (buyerId) => {
  try {
    const { data } = await api.get(`/buyers/${buyerId}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Update Buyer Info
 * PATCH /buyers/:buyerId
 */
export const updateBuyer = async (buyerId, payload) => {
  try {
    const { data } = await api.patch(`/buyers/${buyerId}`, payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/* ---------- BUYER APPROVAL (Admin Dashboard) ---------- */

/** 
 * Approve a buyer's account
 * PATCH /buyers/:id/approve
 */
export const approveBuyer = async (id) => {
  try {
    const { data } = await api.patch(`/buyers/${id}/approve`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Reject a buyer's account
 * PATCH /buyers/:id/reject
 */
export const rejectBuyer = async (id, reason) => {
  try {
    const { data } = await api.patch(`/buyers/${id}/reject`, { reason });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/* ---------- RETURNS / REFUNDS ---------- */
// Adjust base path to match your backend routes (likely "/returns")
const RETURNS_BASE = "/returns";

/**
 * Get all return/refund requests for the logged-in buyer
 * GET /returns
 */
export const getReturnRequests = async (params = {}) => {
  try {
    const { data } = await api.get(RETURNS_BASE, { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/**
 * Create a new return/refund request
 * POST /returns
 */
export const createReturnRequest = async (payload) => {
  try {
    const { data } = await api.post(RETURNS_BASE, payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/* ---------- STAFF VERIFICATION ---------- */
/**
 * Verify employee/staff code (used for linking buyer with staff)
 * GET /staff/verify/:code
 */
export const verifyEmployeeCode = async (code) => {
  try {
    const { data } = await api.get(`/staff/verify/${encodeURIComponent(code)}`);
    // backend returns { ok: true, data: { employeeName, staffUserId, role } }
    return { ok: true, data: data?.data || data };
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || "Failed to verify code";
    return { ok: false, error: msg };
  }
};

/* ---------- DEFAULT EXPORT ---------- */
export default {
  createBuyer,
  list,
  getBuyers,
  getBuyerProfile,
  getById,
  updateBuyer,
  approveBuyer,
  rejectBuyer,
  getReturnRequests,
  createReturnRequest,
  verifyEmployeeCode,
};
