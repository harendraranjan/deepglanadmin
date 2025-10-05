// services/orderService.js
import api from "./api";

export const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

const pickOrder = (data) => data?.order ?? data;

/* -------------------- 1. BUYER FUNCTIONS -------------------- */

export const placeOrder = async (payload) => {
  try {
    const { data } = await api.post("/orders", payload);
    return { ok: true, data: { order: pickOrder(data?.data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- 2. COMMON FUNCTIONS (All Roles) -------------------- */

// ✅ FIXED: Use /orders/my instead of /orders for role-based access
export const getMyOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/my", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ NEW: Admin-only function to get ALL orders
export const getAllOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/orders", { params });
    const orders = Array.isArray(data) ? data : (data?.orders ?? data?.data ?? []);
    return { ok: true, data: { orders }, pagination: data?.pagination };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getById = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getBrandBill = async (orderId, { brand, sellerUserId } = {}) => {
  try {
    const query = `?brand=${encodeURIComponent(brand)}&sellerUserId=${encodeURIComponent(sellerUserId)}`;
    const { data } = await api.get(`/orders/${orderId}/bill${query}`);
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const updateStatus = async (id, statusPayload) => {
  try {
    const { data } = await api.put(`/orders/${id}/status`, statusPayload);
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const cancel = async (id, payload = {}) => {
  try {
    const { data } = await api.delete(`/orders/${id}`, { data: payload });
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- 3. SELLER FUNCTIONS -------------------- */

export const getSellerDashboard = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/seller/dashboard", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getSellerEarnings = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/seller/earnings", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- 4. STAFF FUNCTIONS -------------------- */

export const getStaffDashboard = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/staff/dashboard", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const getStaffBuyers = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/staff/buyers", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const updatePayment = async (id, paymentPayload) => {
  try {
    const { data } = await api.put(`/orders/${id}/payment`, paymentPayload);
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const bulkDispatch = async (orderIds, payload = {}) => {
  try {
    const dispatchPayload = {
      orderIds,
      courier: payload.courier || "Default Courier",
      dispatchNote: payload.note || payload.dispatchNote || ""
    };
    const { data } = await api.post("/orders/dispatch", dispatchPayload);
    return { ok: true, data: data?.results || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- 5. ADMIN FUNCTIONS -------------------- */

// ✅ Use getAllOrders for admin panel
export const list = getAllOrders;

export const bulkUpdate = async (orderIds, status, note = "") => {
  try {
    const payload = { orderIds, status, note };
    const { data } = await api.put("/orders/bulk", payload);
    return { ok: true, data: data?.results || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- 6. UTILITY FUNCTIONS -------------------- */

export const markPacked = async (id, payload = {}) => {
  return updateStatus(id, { status: "packed", ...payload });
};

export const markDispatched = async (id, payload = {}) => {
  try {
    const dispatchPayload = {
      orderIds: [id],
      courier: payload.courier || "Default Courier",
      dispatchNote: payload.note || payload.dispatchNote || ""
    };
    const { data } = await api.post("/orders/dispatch", dispatchPayload);
    return { ok: true, data: { results: data?.results || data } };
  } catch (e) {
    return updateStatus(id, { status: "shipped", ...payload });
  }
};

export const markDelivered = async (id, payload = {}) => {
  return updateStatus(id, { status: "delivered", ...payload });
};

export const markReturned = async (id, payload = {}) => {
  return updateStatus(id, { status: "returned", ...payload });
};

export const formatOrder = (order) => {
  if (!order) return null;
  
  return {
    ...order,
    subtotalFormatted: `₹${(order.subtotal || 0).toFixed(2)}`,
    taxFormatted: `₹${(order.tax || 0).toFixed(2)}`,
    finalAmountFormatted: `₹${(order.finalAmount || 0).toFixed(2)}`,
    statusFormatted: order.status?.charAt(0).toUpperCase() + order.status?.slice(1),
    createdAtFormatted: new Date(order.createdAt).toLocaleDateString()
  };
};

export const getStatusColor = (status) => {
  const statusColors = {
    confirmed: "#orange",
    processing: "#blue",
    packed: "#purple",
    shipped: "#indigo",
    delivered: "#green",
    cancelled: "#red",
    returned: "#gray"
  };
  return statusColors[status] || "#gray";
};

// Export all functions
export default {
  placeOrder,
  getMyOrders,
  getAllOrders, // ✅ NEW
  list,
  getById,
  getBrandBill,
  updateStatus,
  cancel,
  getSellerDashboard,
  getSellerEarnings,
  getStaffDashboard,
  getStaffBuyers,
  updatePayment,
  bulkDispatch,
  bulkUpdate,
  markPacked,
  markDispatched,
  markDelivered,
  markReturned,
  formatOrder,
  getStatusColor,
  parseError
};
