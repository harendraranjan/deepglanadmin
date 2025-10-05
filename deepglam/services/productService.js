// services/productService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/* ---------- PUBLIC ROUTES ---------- */
export const getAllProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products", { params });
    return { ok: true, data };
  } catch (e) {
    console.error("getAllProducts error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

// ✅ Alias for compatibility (Dashboard, AddProductPage etc.)
export const list = getAllProducts;

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return { ok: true, data };
  } catch (e) {
    console.error("getProductById error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- AUTHENTICATED (SELLER) ROUTES ---------- */
export const getMyProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products/my", { params });
    return { ok: true, data };
  } catch (e) {
    console.error("getMyProducts error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const createProduct = async (payload) => {
  try {
    const { data } = await api.post("/products", payload);
    return { ok: true, data };
  } catch (e) {
    console.error("createProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const { data } = await api.put(`/products/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    console.error("updateProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/products/${id}`);
    return { ok: true, data };
  } catch (e) {
    console.error("deleteProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- ADMIN ROUTES ---------- */
export const getDisapprovedProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products/disapproved", { params });
    return { ok: true, data };
  } catch (e) {
    console.error("getDisapprovedProducts error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const approveProduct = async (id) => {
  try {
    const { data } = await api.patch(`/products/${id}/approve`);
    return { ok: true, data };
  } catch (e) {
    console.error("approveProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const rejectProduct = async (id, reason = "") => {
  try {
    const { data } = await api.patch(`/products/${id}/reject`, { reason });
    return { ok: true, data };
  } catch (e) {
    console.error("rejectProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const cloneProduct = async (id) => {
  try {
    const { data } = await api.post(`/products/${id}/clone`);
    return { ok: true, data };
  } catch (e) {
    console.error("cloneProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- PRODUCT TYPES (Master setup) ---------- */
export const getProductTypes = async () => {
  try {
    const { data } = await api.get("/products/types");
    return { ok: true, data };
  } catch (e) {
    console.error("getProductTypes error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const createProductType = async (body) => {
  try {
    const { data } = await api.post("/products/types", body);
    return { ok: true, data };
  } catch (e) {
    console.error("createProductType error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const deleteProductType = async (id) => {
  try {
    const { data } = await api.delete(`/products/types/${id}`);
    return { ok: true, data };
  } catch (e) {
    console.error("deleteProductType error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- HELPER METHODS ---------- */
export const getProductsFiltered = async (filters = {}) => {
  const params = {};

  if (filters.gender && filters.gender !== "all") {
    params.mainCategory = filters.gender === "women" ? "Women" : "Men";
  }

  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.colors?.length) params.colors = filters.colors.join(",");
  if (filters.sort) params.sort = filters.sort;
  if (filters.limit) params.limit = filters.limit;

  return getAllProducts(params);
};

export const getTrendingProducts = async (limit = 8) => {
  return getAllProducts({ sort: "-sold", limit });
};

export const getLatestProducts = async (limit = 8) => {
  return getAllProducts({ sort: "-createdAt", limit });
};

/* ---------- DEFAULT EXPORT ---------- */
export default {
  // Public
  getAllProducts,
  list,
  getProductById,

  // Seller
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  // Admin
  getDisapprovedProducts,
  approveProduct,
  rejectProduct,
  cloneProduct,

  // Product types
  getProductTypes,
  createProductType,
  deleteProductType,

  // Helpers
  getProductsFiltered,
  getTrendingProducts,
  getLatestProducts,
};
