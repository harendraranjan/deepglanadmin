import api from "./api";

const parseError = (err) =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong";

/* CRUD */
export const createBuyer = async (payload) => {
  try { const { data } = await api.post("/buyers", payload); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};
export const updateBuyer = async (buyerId, payload) => {
  try { const { data } = await api.patch(`/buyers/${buyerId}`, payload); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};
export const getById = async (buyerId) => {
  try { const { data } = await api.get(`/buyers/${buyerId}`); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};
export const list = async (params = {}) => {
  try { const { data } = await api.get("/buyers", { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};
// 🔹 Add alias name expected by pages
export const getBuyers = list;

export const remove = async (buyerId) => {
  try { const { data } = await api.delete(`/buyers/${buyerId}`); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

/* Address */
export const updateBuyerAddress = async (buyerId, payload) => {
  try { const { data } = await api.patch(`/buyers/${buyerId}/address`, payload); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

/* Staff link */
export const assignStaff = async (buyerId, payload) => {
  try { const { data } = await api.patch(`/buyers/${buyerId}/assign-staff`, payload); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

/* Orders (buyer scoped) */
export const getOrders = async (buyerId, params = {}) => {
  try { const { data } = await api.get(`/buyers/${buyerId}/orders`, { params }); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};
export const getOrderById = async (buyerId, orderId) => {
  try { const { data } = await api.get(`/buyers/${buyerId}/orders/${orderId}`); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

/* 🔹 Approval actions expected by admin UI */
export const approveBuyer = async (buyerId) => {
  try { const { data } = await api.put(`/buyers/approve/${buyerId}`); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};
export const rejectBuyer = async (buyerId, payload = {}) => {
  try { const { data } = await api.put(`/buyers/reject/${buyerId}`, payload); return { ok: true, data }; }
  catch (err) { return { ok: false, error: parseError(err) }; }
};

export default {
  createBuyer, updateBuyer, getById, list, getBuyers, remove,
  updateBuyerAddress, assignStaff, getOrders, getOrderById,
  approveBuyer, rejectBuyer,
};
