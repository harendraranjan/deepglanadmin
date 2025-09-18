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

export const list = async (params = {}) => {
  try {
    const { data } = await api.get("/buyers", { params });
    return { ok: true, data };
  } catch (err) { 
    return { ok: false, error: parseError(err) }; 
  }
};

export const getBuyerProfile = async () => {
  try {
    const { data } = await api.get("/buyers/my");
    return { ok: true, data };
  } catch (err) { 
    return { ok: false, error: parseError(err) }; 
  }
};

export const getById = async (buyerId) => {
  try {
    const { data } = await api.get(`/buyers/${buyerId}`);
    return { ok: true, data };
  } catch (err) { 
    return { ok: false, error: parseError(err) }; 
  }
};

export const updateBuyer = async (buyerId, payload) => {
  try {
    const { data } = await api.patch(`/buyers/${buyerId}`, payload);
    return { ok: true, data };
  } catch (err) { 
    return { ok: false, error: parseError(err) }; 
  }
};

/* ---------- DEFAULT EXPORT ---------- */
export default {
  createBuyer,
  list,
  getBuyerProfile,
  getById,
  updateBuyer,
};