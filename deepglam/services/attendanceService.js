import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

// POST /attendance/check-in
export const checkIn = async (payload) => {
  try { const { data } = await api.post("/attendance/check-in", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// POST /attendance/check-out
export const checkOut = async (payload) => {
  try { const { data } = await api.post("/attendance/check-out", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// GET /attendance/:staffId/:month
export const getByStaff = async (staffId, month) => {
  try { const { data } = await api.get(`/attendance/${staffId}/${month}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default { checkIn, checkOut, getByStaff };
