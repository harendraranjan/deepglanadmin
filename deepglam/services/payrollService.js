// services/payrollService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

// POST /payroll/generate
export const generate = async (payload) => {
  try {
    const { data } = await api.post("/payroll/generate", payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// GET /payroll/:staffId/:month
export const getByStaffMonth = async (staffId, month) => {
  try {
    const { data } = await api.get(`/payroll/${staffId}/${month}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// GET /payroll
export const list = async (params = {}) => {
  try {
    const { data } = await api.get("/payroll", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// PUT /payroll/mark-paid/:id
export const markPaid = async (id) => {
  try {
    const { data } = await api.put(`/payroll/mark-paid/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export default { generate, getByStaffMonth, list, markPaid };
