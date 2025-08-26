import api from "./api";

export const parseError = (e) =>
  e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

export const placeOrder = async (payload) => {
  try { const { data } = await api.post("/orders", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const list = async (params = {}) => {
  try { const { data } = await api.get("/orders", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// 🔹 Add this named export expected by the dashboard
export const getAllOrders = list;

export const getById = async (id) => {
  try { const { data } = await api.get(`/orders/${id}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const markPacked = async (id, payload = {}) => {
  try { const { data } = await api.patch(`/orders/${id}/pack`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const markDispatched = async (id, payload = {}) => {
  try { const { data } = await api.post(`/orders/${id}/dispatch`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const markDelivered = async (id, payload = {}) => {
  try { const { data } = await api.patch(`/orders/${id}/deliver`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const updateStatus = async (id, statusPayload) => {
  try { const { data } = await api.patch(`/orders/${id}/status`, statusPayload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const cancel = async (id, payload = {}) => updateStatus(id, { status: "cancelled", ...payload });
export const markReturned = async (id, payload = {}) => updateStatus(id, { status: "returned", ...payload });
export const getReturnOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/returns", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const updateOrderStatus = async (orderId, status, note) => {
  try {
    const { data } = await api.put(`/orders/${orderId}/status`, { status, note });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};
export default {
  placeOrder,
  list,
  getAllOrders, // keep in default too (optional)
  getById,
  markPacked,
  markDispatched,
  markDelivered,
  updateStatus,
  cancel,
  markReturned,
  parseError,
  getReturnOrders,
  updateOrderStatus
};
