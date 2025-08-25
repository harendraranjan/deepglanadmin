import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

// POST /notifications/send
export const send = async (payload) => {
  try { const { data } = await api.post("/notifications/send", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// GET /notifications/:userId
export const getByUser = async (userId) => {
  try { const { data } = await api.get(`/notifications/${userId}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// PUT /notifications/seen/:id
export const markSeen = async (id) => {
  try { const { data } = await api.put(`/notifications/seen/${id}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default { send, getByUser, markSeen };
