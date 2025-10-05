import api from "./api";

// Common error parser
const parseError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

/* ============================
   📊 ANALYTICS SERVICE METHODS
   ============================ */

/** 
 * Get Staff Performance Analytics
 * @endpoint GET /analytics/staff-performance
 */
export const getStaffPerformance = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/staff-performance", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Get Top Selling Products
 * @endpoint GET /analytics/top-products
 */
export const getTopProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/top-products", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Get Buyer Activity (Login, Purchase, etc.)
 * @endpoint GET /analytics/buyer-activity
 */
export const getBuyerActivity = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/buyer-activity", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** 
 * Get Vendor Report (Fix for Missing Export Error)
 * @endpoint GET /analytics/vendor-report
 */
export const getVendorReport = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/vendor-report", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/* ✅ Default Export (for consistency) */
export default {
  getStaffPerformance,
  getTopProducts,
  getBuyerActivity,
  getVendorReport,
};
