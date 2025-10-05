// services/staffService.js
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

const ok = (data) => ({ ok: true, data });
const fail = (e) => ({ ok: false, error: parseError(e) });

/* ========= STAFF CRUD ========= */
export async function createStaff(body) {
  try {
    const { data } = await api.post("/staff", body);
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function getAllStaff({ page = 1, q = "" } = {}) {
  try {
    const { data } = await api.get("/staff", { params: { page, q } });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/* alias for compatibility (used as list in dashboard) */
export const list = (params) => getAllStaff(params);

export async function getStaffByCode(code) {
  try {
    const { data } = await api.get(`/staff/${encodeURIComponent(code)}`);
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function updateStaff(id, body) {
  try {
    const { data } = await api.patch(`/staff/${id}`, body);
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/* ========= ATTENDANCE ========= */
export async function attendanceCheckIn() {
  try {
    const { data } = await api.post("/staff/attendance/check-in");
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function attendanceCheckOut() {
  try {
    const { data } = await api.post("/staff/attendance/check-out");
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/**
 * getMyAttendance({ month })
 * Expected response: { summary, logs }
 */
export async function getMyAttendance({ month } = {}) {
  try {
    const { data } = await api.get("/staff/attendance/me", { params: { month } });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/* ========= BUYERS & ORDERS ========= */
export async function getMyBuyers({ page = 1, q = "" } = {}) {
  try {
    const { data } = await api.get("/staff/my-buyers", { params: { page, q } });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function getOrders({ page = 1, q = "", status } = {}) {
  try {
    const { data } = await api.get("/staff/orders", { params: { page, q, status } });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function getOrdersCount() {
  try {
    const { data } = await api.get("/staff/orders/count");
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function markReadyToDispatch({ id, courier, awb }) {
  try {
    const { data } = await api.patch(`/staff/orders/${id}/ready-to-dispatch`, {
      courier,
      awb,
    });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/* ========= PAYMENTS ========= */
export async function getPaymentsPending({ page = 1, q = "", minDays, month } = {}) {
  try {
    const params = { page, q, month };
    if (minDays != null && minDays !== "") params.minDays = Number(minDays);
    const { data } = await api.get("/staff/payments/pending", { params });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

export async function collectPayment({
  buyerId,
  amount,
  method,
  reference,
  note,
  date,
}) {
  try {
    const { data } = await api.post("/staff/payments/collect", {
      buyerId,
      amount,
      method,
      reference,
      note,
      date,
    });
    return ok(data);
  } catch (e) {
    return fail(e);
  }
}

/* Optional: placeholder until backend route available */
export async function getPaymentsCollected() {
  return ok({ items: [], total: 0, hasMore: false });
}

/* ========= DEFAULT EXPORT ========= */
export default {
  createStaff,
  getAllStaff,
  list,
  getStaffByCode,
  updateStaff,
  attendanceCheckIn,
  attendanceCheckOut,
  getMyAttendance,
  getMyBuyers,
  getOrders,
  getOrdersCount,
  markReadyToDispatch,
  getPaymentsPending,
  collectPayment,
  getPaymentsCollected,
};
