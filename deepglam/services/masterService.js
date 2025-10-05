import api from "./api";

const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";


// ========================================
// 📦 HSN CRUD Operations
// ========================================

/** Create HSN */
export const createHSN = async (payload) => {
  try { 
    const { data } = await api.post("/master/hsn", payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get All HSNs */
export const getHSNs = async (params = {}) => {
  try { 
    const { data } = await api.get("/master/hsn", { params }); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get Single HSN by ID */
export const getHSNById = async (id) => {
  try { 
    const { data } = await api.get(`/master/hsn/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Update HSN */
export const updateHSN = async (id, payload) => {
  try { 
    const { data } = await api.put(`/master/hsn/${id}`, payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Delete HSN */
export const deleteHSN = async (id) => {
  try { 
    const { data } = await api.delete(`/master/hsn/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};


// ========================================
// 🌍 LOCATION CRUD Operations
// ========================================

/** Create Location */
export const createLocation = async (payload) => {
  try { 
    const { data } = await api.post("/master/location", payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get All Locations */
export const getAllLocations = async (params = {}) => {
  try { 
    const { data } = await api.get("/master/location", { params }); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get Location by Pincode */
export const getLocation = async (pincode) => {
  try { 
    const { data } = await api.get(`/master/location/${pincode}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Upsert Location (Create or Update) */
export const upsertLocation = async (payload) => {
  try { 
    const { data } = await api.put("/master/location/upsert", payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Update Location by ID */
export const updateLocation = async (id, payload) => {
  try { 
    const { data } = await api.put(`/master/location/${id}`, payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Delete Location */
export const deleteLocation = async (id) => {
  try { 
    const { data } = await api.delete(`/master/location/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};


// ========================================
// 💰 PROFIT MARGIN CRUD Operations
// ========================================

/** Create Profit Margin */
export const createProfit = async (payload) => {
  try { 
    const { data } = await api.post("/master/profit", payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get All Profit Margins */
export const getProfits = async () => {
  try { 
    const { data } = await api.get("/master/profit"); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get Single Profit Margin by ID */
export const getProfitById = async (id) => {
  try { 
    const { data } = await api.get(`/master/profit/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Set/Upsert Profit Margin (Create or Update by category) */
export const setProfit = async (payload) => {
  try { 
    const { data } = await api.put("/master/profit/set", payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Update Profit Margin by ID */
export const updateProfit = async (id, payload) => {
  try { 
    const { data } = await api.put(`/master/profit/${id}`, payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Delete Profit Margin */
export const deleteProfit = async (id) => {
  try { 
    const { data } = await api.delete(`/master/profit/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};


// ========================================
// 🖼️ BANNER CRUD Operations
// ========================================

/** Create Banner */
export const createBanner = async (payload) => {
  try { 
    const { data } = await api.post("/master/banner", payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get All Banners */
export const getBanners = async () => {
  try { 
    const { data } = await api.get("/master/banner"); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Get Single Banner by ID */
export const getBannerById = async (id) => {
  try { 
    const { data } = await api.get(`/master/banner/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Update Banner */
export const updateBanner = async (id, payload) => {
  try { 
    const { data } = await api.put(`/master/banner/${id}`, payload); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};

/** Delete Banner */
export const deleteBanner = async (id) => {
  try { 
    const { data } = await api.delete(`/master/banner/${id}`); 
    return { ok: true, data }; 
  } catch (e) { 
    return { ok: false, error: parseError(e) }; 
  }
};


// ========================================
// 📤 Default Export
// ========================================

export default {
  // HSN
  createHSN,
  getHSNs,
  getHSNById,
  updateHSN,
  deleteHSN,
  
  // Location
  createLocation,
  getAllLocations,
  getLocation,
  upsertLocation,
  updateLocation,
  deleteLocation,
  
  // Profit
  createProfit,
  getProfits,
  getProfitById,
  setProfit,
  updateProfit,
  deleteProfit,
  
  // Banner
  createBanner,
  getBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
