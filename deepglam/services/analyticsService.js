import api from "./api";

const parseError = (err) =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong";

// Already in your file:
export const getStaffPerformance = async (params = {}) => {
  try { const { data } = await api.get("/analytics/staff-performance", { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

export const getTopProducts = async (params = {}) => {
  try { const { data } = await api.get("/analytics/top-products", { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

export const getBuyerActivity = async (params = {}) => {
  try { const { data } = await api.get("/analytics/buyer-activity", { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

// 🔹 Add these (used by /users/buyer-report and /users/vendor-report pages)
export const getBuyerReport = async (params = {}) => {
  try { const { data } = await api.get("/analytics/buyers", { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

export const getVendorReport = async (params = {}) => {
  try { const { data } = await api.get("/analytics/vendors", { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

export default {
  getStaffPerformance,
  getTopProducts,
  getBuyerActivity,
  getBuyerReport,
  getVendorReport,
};
