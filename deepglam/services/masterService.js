// services/masterService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/* ============================================================
📁 CATEGORY CRUD
============================================================ */
export const getCategories = async () => {
  try {
    const { data } = await api.get("/master/categories");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createCategory = async (payload) => {
  try {
    const { data } = await api.post("/master/categories", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await api.delete(`/master/categories/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
📁 SUBCATEGORY CRUD
============================================================ */
export const getSubcategories = async () => {
  try {
    const { data } = await api.get("/master/subcategories");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createSubcategory = async (payload) => {
  try {
    const { data } = await api.post("/master/subcategories", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteSubcategory = async (id) => {
  try {
    const { data } = await api.delete(`/master/subcategories/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
🌍 STATE / COUNTRY CRUD
============================================================ */
export const getCountries = async () => {
  try {
    const { data } = await api.get("/master/countries");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getStates = async (countryId) => {
  try {
    const { data } = await api.get("/master/states", {
      params: { countryId },
    });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createState = async (payload) => {
  try {
    const { data } = await api.post("/master/states", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteState = async (id) => {
  try {
    const { data } = await api.delete(`/master/states/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
🏷️ SIZE CRUD
============================================================ */
export const getSizes = async () => {
  try {
    const { data } = await api.get("/master/sizes");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createSize = async (payload) => {
  try {
    const { data } = await api.post("/master/sizes", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteSize = async (id) => {
  try {
    const { data } = await api.delete(`/master/sizes/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
🎟️ COUPON CRUD
============================================================ */
export const getCoupons = async () => {
  try {
    const { data } = await api.get("/master/coupons");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createCoupon = async (payload) => {
  try {
    const { data } = await api.post("/master/coupons", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteCoupon = async (id) => {
  try {
    const { data } = await api.delete(`/master/coupons/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
🎟️ COUPON - validate & mark-used (apply flow)
============================================================ */
export const validateCoupon = async (payload) => {
  try {
    const { data } = await api.post("/master/coupons/validate", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const markCouponUsed = async (payload) => {
  try {
    const { data } = await api.post("/master/coupons/mark-used", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
🖼️ BANNERS CRUD
============================================================ */
export const getBanners = async () => {
  try {
    const { data } = await api.get("/master/banners");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createBanner = async (payload) => {
  try {
    const { data } = await api.post("/master/banners", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteBanner = async (id) => {
  try {
    const { data } = await api.delete(`/master/banners/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
🧾 HSN CRUD
- added updateHSN (PATCH /master/hsn/:id)
============================================================ */
export const getHSNs = async () => {
  try {
    const { data } = await api.get("/master/hsn");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createHSN = async (payload) => {
  try {
    const { data } = await api.post("/master/hsn", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const updateHSN = async (id, payload) => {
  try {
    const { data } = await api.patch(`/master/hsn/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteHSN = async (id) => {
  try {
    const { data } = await api.delete(`/master/hsn/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
📍 LOCATION CRUD
- endpoints assumed: /master/locations
============================================================ */
export const getAllLocations = async (params = {}) => {
  try {
    const { data } = await api.get("/master/locations", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createLocation = async (payload) => {
  try {
    const { data } = await api.post("/master/locations", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const updateLocation = async (id, payload) => {
  try {
    const { data } = await api.patch(`/master/locations/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteLocation = async (id) => {
  try {
    const { data } = await api.delete(`/master/locations/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
📈 PROFIT / MARGIN CRUD
- endpoints assumed: /master/profits
============================================================ */
export const getProfits = async () => {
  try {
    const { data } = await api.get("/master/profits");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const createProfit = async (payload) => {
  try {
    const { data } = await api.post("/master/profits", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const updateProfit = async (id, payload) => {
  try {
    const { data } = await api.patch(`/master/profits/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const deleteProfit = async (id) => {
  try {
    const { data } = await api.delete(`/master/profits/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ============================================================
📢 DEFAULT EXPORT
============================================================ */
export default {
  // Categories
  getCategories,
  createCategory,
  deleteCategory,

  // Subcategories
  getSubcategories,
  createSubcategory,
  deleteSubcategory,

  // States / Countries
  getCountries,
  getStates,
  createState,
  deleteState,

  // Sizes
  getSizes,
  createSize,
  deleteSize,

  // Coupons
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon,
  markCouponUsed,

  // Banners
  getBanners,
  createBanner,
  deleteBanner,

  // HSN
  getHSNs,
  createHSN,
  updateHSN,
  deleteHSN,

  // Locations
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,

  // Profits
  getProfits,
  createProfit,
  updateProfit,
  deleteProfit,
};
