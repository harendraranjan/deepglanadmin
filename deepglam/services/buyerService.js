import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

// POST /buyers
export const create = async (payload) => {
  try { const { data } = await api.post("/buyers", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /buyers/:id
export const update = async (id, payload) => {
  try { const { data } = await api.put(`/buyers/${id}`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// GET /buyers
export const list = async (params = {}) => {
  try { const { data } = await api.get("/buyers", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// GET /buyers/:id
export const getById = async (id) => {
  try { const { data } = await api.get(`/buyers/${id}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /buyers/:id/approve
export const approve = async (id) => {
  try { const { data } = await api.put(`/buyers/${id}/approve`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /buyers/:id/reject
export const reject = async (id, payload = {}) => {
  try { const { data } = await api.put(`/buyers/${id}/reject`, payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// DELETE /buyers/:id
export const remove = async (id) => {
  try { const { data } = await api.delete(`/buyers/${id}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default { create, update, list, getById, approve, reject, remove };
