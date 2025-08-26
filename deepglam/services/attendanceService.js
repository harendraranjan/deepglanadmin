import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

export const checkIn = async (payload) => {
  try { const { data } = await api.post("/attendance/check-in", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const checkOut = async (payload) => {
  try { const { data } = await api.post("/attendance/check-out", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const getByStaff = async (staffId, month) => {
  try { const { data } = await api.get(`/attendance/${staffId}/${month}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

// 🔹 Add this for the admin attendance list page
export const getAttendance = async (params = {}) => {
  try { const { data } = await api.get(`/attendance`, { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default { checkIn, checkOut, getByStaff, getAttendance };
