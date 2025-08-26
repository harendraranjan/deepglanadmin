/*import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

// GET /sellers/disapproved
export const getDisapproved = async (params = {}) => {
  try { const { data } = await api.get("/sellers/disapproved", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /sellers/approve/:sellerId
export const approve = async (sellerId) => {
  try { const { data } = await api.put(`/sellers/approve/${sellerId}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// GET /sellers
export const list = async (params = {}) => {
  try { const { data } = await api.get("/sellers", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// POST /sellers
export const create = async (payload) => {
  try { const { data } = await api.post("/sellers", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /sellers/reject/:id
export const reject = async (id, payload = {}) => {
  try { const { data } = await api.put(`/sellers/reject/${id}`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /sellers/:id
export const update = async (id, payload) => {
  try { const { data } = await api.put(`/sellers/${id}`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// GET /sellers/:id
export const getById = async (id) => {
  try { const { data } = await api.get(`/sellers/${id}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default { getDisapproved, approve, list, create, reject, update, getById };
*/
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

// GET /sellers/disapproved
export const getDisapproved = async (params = {}) => {
  try {
    const { data } = await api.get("/sellers/disapproved", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// PUT /sellers/approve/:sellerId
export const approve = async (sellerId) => {
  try {
    const { data } = await api.put(`/sellers/approve/${sellerId}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// GET /sellers
export const list = async (params = {}) => {
  try {
    const { data } = await api.get("/sellers", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// POST /sellers
export const create = async (payload) => {
  try {
    const { data } = await api.post("/sellers", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// PUT /sellers/reject/:id
export const reject = async (id, payload = {}) => {
  try {
    const { data } = await api.put(`/sellers/reject/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// PUT /sellers/:id
export const update = async (id, payload) => {
  try {
    const { data } = await api.put(`/sellers/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// GET /sellers/:id
export const getById = async (id) => {
  try {
    const { data } = await api.get(`/sellers/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ GET /sellers/profile
export const getSellerProfile = async () => {
  try {
    const { data } = await api.get("/sellers/profile");
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getSellers = async (params = {}) => {
  try { const { data } = await api.get("/sellers", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const approveSeller = async (sellerId) => {
  try { const { data } = await api.put(`/sellers/approve/${sellerId}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const rejectSeller = async (sellerId, payload = {}) => {
  try { const { data } = await api.put(`/sellers/reject/${sellerId}`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};


// Default export with all functions
export default {
  getDisapproved,
  approve,
  list,
  create,
  reject,
  update,
  getById,
  getSellerProfile,
  getSellers, approveSeller, rejectSeller
};
