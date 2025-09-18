import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/* ---------- PUBLIC ROUTES ---------- */
export const getAllProducts = async (params = {}) => {
  try {
    // console.log("Fetching products with params:", params); // Debug log
    const { data } = await api.get("/products", { params });
    // console.log("Products response:", data); // Debug log
    return { ok: true, data };
  } catch (e) {
    console.error("getAllProducts error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    console.log("Products response:", data);
    return { ok: true, data };
  } catch (e) {
    console.error("getProductById error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- AUTHENTICATED ROUTES ---------- */
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
export const approveProduct = async (id) => {
  try {
    const { data } = await api.put(`/products/approve/${id}`);
    return { ok: true, data };
  } catch (e) {
    console.error("approveProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const rejectProduct = async (id) => {
  try {
    const { data } = await api.put(`/products/reject/${id}`);
    return { ok: true, data };
  } catch (e) {
    console.error("rejectProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

export const cloneProduct = async (id) => {
  try {
    const { data } = await api.post(`/products/clone/${id}`);
    return { ok: true, data };
  } catch (e) {
    console.error("cloneProduct error:", parseError(e));
    return { ok: false, error: parseError(e) };
  }
};

/* ---------- HELPER METHODS (for frontend compatibility) ---------- */
// ✅ Add alias for your frontend code that might use 'list'
export const list = getAllProducts;

// ✅ Helper to get products with better filtering
export const getProductsFiltered = async (filters = {}) => {
  const params = {};
  
  // Handle gender filter
  if (filters.gender && filters.gender !== "all") {
    params.mainCategory = filters.gender === "women" ? "Women" : "Men";
  }
  
  // Handle price range
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  
  // Handle colors
  if (filters.colors && filters.colors.length) {
    params.colors = filters.colors.join(",");
  }
  
  // Handle sorting
  if (filters.sort) params.sort = filters.sort;
  if (filters.limit) params.limit = filters.limit;
  
  return getAllProducts(params);
};

// ✅ Get trending products (high sales)
export const getTrendingProducts = async (limit = 8) => {
  return getAllProducts({ sort: "-sold", limit });
};

// ✅ Get latest products
export const getLatestProducts = async (limit = 8) => {
  return getAllProducts({ sort: "-createdAt", limit });
};

/* ---------- DEFAULT EXPORT ---------- */
export default {
  // Public
  getAllProducts,
  getProductById,
  list, // ✅ Alias for compatibility
  
  // Authenticated  
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Admin
  approveProduct,
  rejectProduct,
  cloneProduct,
  
  // ✅ Helper methods
  getProductsFiltered,
  getTrendingProducts,
  getLatestProducts,
};