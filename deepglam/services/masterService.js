import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

/* --------- Brand --------- */
export const getBrands = async (params = {}) => { try { const { data } = await api.get("/master/brands", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createBrand = async (payload) => { try { const { data } = await api.post("/master/brands", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteBrand = async (id) => { try { const { data } = await api.delete(`/master/brands/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* ----- Categories & Subcategories ----- */
export const getCategories = async (params = {}) => { try { const { data } = await api.get("/master/categories", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createCategory = async (payload) => { try { const { data } = await api.post("/master/categories", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteCategory = async (id) => { try { const { data } = await api.delete(`/master/categories/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

export const getSubcategories = async (categoryId, params = {}) => { try { const { data } = await api.get(`/master/categories/${categoryId}/subcategories`, { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createSubcategory = async (categoryId, payload) => { try { const { data } = await api.post(`/master/categories/${categoryId}/subcategories`, payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteSubcategory = async (categoryId, subId) => { try { const { data } = await api.delete(`/master/categories/${categoryId}/subcategories/${subId}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Sizes --------- */
export const getSizes = async (params = {}) => { try { const { data } = await api.get("/master/sizes", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createSize = async (payload) => { try { const { data } = await api.post("/master/sizes", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteSize = async (id) => { try { const { data } = await api.delete(`/master/sizes/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Colors --------- */
export const getColors = async (params = {}) => { try { const { data } = await api.get("/master/colors", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createColor = async (payload) => { try { const { data } = await api.post("/master/colors", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteColor = async (id) => { try { const { data } = await api.delete(`/master/colors/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Countries / States / Cities --------- */
export const getCountries = async (params = {}) => { try { const { data } = await api.get("/master/countries", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createCountry = async (payload) => { try { const { data } = await api.post("/master/countries", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteCountry = async (id) => { try { const { data } = await api.delete(`/master/countries/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

export const getStates = async (params = {}) => { try { const { data } = await api.get("/master/states", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createState = async (payload) => { try { const { data } = await api.post("/master/states", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteState = async (id) => { try { const { data } = await api.delete(`/master/states/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

export const getCities = async (params = {}) => { try { const { data } = await api.get("/master/cities", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createCity = async (payload) => { try { const { data } = await api.post("/master/cities", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteCity = async (id) => { try { const { data } = await api.delete(`/master/cities/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Locations --------- */
export const getLocations = async (params = {}) => { try { const { data } = await api.get("/master/locations", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createLocation = async (payload) => { try { const { data } = await api.post("/master/locations", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteLocation = async (id) => { try { const { data } = await api.delete(`/master/locations/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Coupons --------- */
export const getCoupons = async (params = {}) => { try { const { data } = await api.get("/master/coupons", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createCoupon = async (payload) => { try { const { data } = await api.post("/master/coupons", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteCoupon = async (id) => { try { const { data } = await api.delete(`/master/coupons/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- HSN --------- */
export const getHSN = async (params = {}) => { try { const { data } = await api.get("/master/hsn", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteHSN = async (id) => { try { const { data } = await api.delete(`/master/hsn/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Banner --------- */
export const deleteBanner = async (id) => { try { const { data } = await api.delete(`/master/banners/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };

/* --------- Blog --------- */
export const getBlogs = async (params = {}) => { try { const { data } = await api.get("/master/blogs", { params }); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const createBlog = async (payload) => { try { const { data } = await api.post("/master/blogs", payload); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
export const deleteBlog = async (id) => { try { const { data } = await api.delete(`/master/blogs/${id}`); return { ok: true, data }; } catch (e) { return { ok: false, error: parseError(e) }; } };
/* ───── Banners ───── */
export const getBanners = async (params = {}) => {
  try {
    const { data } = await api.get("/master/banners", { params });
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

/* ───── HSN ───── */
export const createHSN = async (payload) => {
  try {
    const { data } = await api.post("/master/hsn", payload); // or PUT if your API uses PUT
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ───── Profit % Master ───── */
export const getProfits = async () => {
  try {
    const { data } = await api.get("/master/profit");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const setProfit = async (payload) => {
  try {
    // switch to PUT if your backend expects update
    const { data } = await api.post("/master/profit", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};
export default {
  getBrands, createBrand, deleteBrand,
  getCategories, createCategory, deleteCategory,
  getSubcategories, createSubcategory, deleteSubcategory,
  getSizes, createSize, deleteSize,
  getColors, createColor, deleteColor,
  getCountries, createCountry, deleteCountry,
  getStates, createState, deleteState,
  getCities, createCity, deleteCity,
  getLocations, createLocation, deleteLocation,
  getCoupons, createCoupon, deleteCoupon,
  getHSN, deleteHSN,
  deleteBanner,
  getBlogs, createBlog, deleteBlog,
  getBanners,createBanner,createHSN,getProfits,setProfit
};
