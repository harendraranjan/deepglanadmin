import api from "./api";

const parseError = (err) =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong";

// GET /analytics/staff-performance
export const getStaffPerformance = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/staff-performance", { params });
    return { ok: true, data };
  } catch (err) { return { ok: false, error: parseError(err) }; }
};

// GET /analytics/top-products
export const getTopProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/top-products", { params });
    return { ok: true, data };
  } catch (err) { return { ok: false, error: parseError(err) }; }
};

// GET /analytics/buyer-activity
export const getBuyerActivity = async (params = {}) => {
  try {
    const { data } = await api.get("/analytics/buyer-activity", { params });
    return { ok: true, data };
  } catch (err) { return { ok: false, error: parseError(err) }; }
};

export default { getStaffPerformance, getTopProducts, getBuyerActivity };
