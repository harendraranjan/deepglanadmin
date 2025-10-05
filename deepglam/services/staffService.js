// services/staffService.js
import api from "./api";

const parseError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  String(err) ||
  "Something went wrong";

const ok = (data) => ({ ok: true, data });
const fail = (error) => ({ ok: false, error });

/** ========= STAFF CRUD ========= */
export async function createStaff(body) {
  try {
    const { data } = await api.post("/staff", body);
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

/** `list` used by admin UI; params can include page, q, etc. */
export async function list(params = {}) {
  try {
    const { data } = await api.get("/staff", { params });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

/** Alternative name kept (backwards compat) */
export async function getAllStaff(params = {}) {
  return list(params);
}

export async function getStaffByCode(code) {
  try {
    const { data } = await api.get(`/staff/${encodeURIComponent(code)}`);
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

export async function updateStaff(id, body) {
  try {
    const { data } = await api.patch(`/staff/${id}`, body);
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

/** ========= ATTENDANCE ========= */
export async function attendanceCheckIn() {
  try {
    const { data } = await api.post("/staff/attendance/check-in");
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}
export async function attendanceCheckOut() {
  try {
    const { data } = await api.post("/staff/attendance/check-out");
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}
export async function getMyAttendance({ month } = {}) {
  try {
    const { data } = await api.get("/staff/attendance/me", { params: { month } });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

/** ========= BUYERS & ORDERS (staff-scoped endpoints) ========= */
export async function getMyBuyers(params = {}) {
  try {
    const { data } = await api.get("/staff/my-buyers", { params });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

export async function getOrders(params = {}) {
  try {
    const { data } = await api.get("/staff/orders", { params });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

export async function getOrdersCount() {
  try {
    const { data } = await api.get("/staff/orders/count");
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

export async function markReadyToDispatch({ id, courier, awb }) {
  try {
    const { data } = await api.patch(`/staff/orders/${id}/ready-to-dispatch`, { courier, awb });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

/** ========= PAYMENTS ========= */
export async function getPaymentsPending(params = {}) {
  try {
    // normalize params: allow page, q, minDays, month
    const p = { ...params };
    if (p.minDays != null && p.minDays !== "") p.minDays = Number(p.minDays);
    const { data } = await api.get("/staff/payments/pending", { params: p });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

export async function collectPayment({ buyerId, amount, method, reference, note, date }) {
  try {
    const { data } = await api.post("/staff/payments/collect", {
      buyerId, amount, method, reference, note, date,
    });
    return ok(data);
  } catch (e) {
    return fail(parseError(e));
  }
}

/** Placeholder - if backend exposes collected list later, replace this */
export async function getPaymentsCollected(params = {}) {
  try {
    const { data } = await api.get("/staff/payments/collected", { params });
    return ok(data);
  } catch (e) {
    // If endpoint doesn't exist, return an empty shape instead of throwing
    return ok({ items: [], total: 0, hasMore: false });
  }
}

/** ========= DEFAULT EXPORT (for convenience) ========= */
export default {
  createStaff,
  list,
  getAllStaff,
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
