// services/orderService.js
import api from "./api";

export const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

// normalize various server shapes into a consistent object
const pickOrder = (data) => data?.order ?? data;

/* -------------------- Place & Read -------------------- */
export const placeOrder = async (payload) => {
  try {
    const { data } = await api.post("/orders", payload);
    return { ok: true, data: { order: pickOrder(data?.data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ NEW: Get orders with role-based filtering  
export const getMyOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/my", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const list = async (params = {}) => {
  try {
    const { data } = await api.get("/orders", { params });
    // server may return {orders:[...]} or [...]
    const orders = Array.isArray(data) ? data : (data?.orders ?? data?.data ?? []);
    return { ok: true, data: { orders } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// Buyer-scoped list (recommended for "my orders")
export const listByBuyer = async (buyerId, params = {}) => {
  try {
    const { data } = await api.get(`/buyers/${buyerId}/orders`, { params });
    const orders = Array.isArray(data) ? data : (data?.orders ?? []);
    return { ok: true, data: { orders } };
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

// Buyer-scoped detail (strict ownership)
export const getBuyerOrderById = async (buyerId, orderId) => {
  try {
    const { data } = await api.get(`/buyers/${buyerId}/orders/${orderId}`);
    return { ok: true, data: { order: pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- NEW: Dashboard Functions -------------------- */

// ✅ NEW: Seller Dashboard
export const getSellerDashboard = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/seller/dashboard", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ NEW: Seller Earnings
export const getSellerEarnings = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/seller/earnings", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ NEW: Staff Dashboard  
export const getStaffDashboard = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/staff/dashboard", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ NEW: Staff Buyers
export const getStaffBuyers = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/staff/buyers", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ------------------ Status transitions ----------------- */

// ✅ UPDATED: Use correct endpoint
export const updateStatus = async (id, statusPayload) => {
  try {
    const { data } = await api.put(`/orders/${id}/status`, statusPayload);
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const markPacked = async (id, payload = {}) => {
  return updateStatus(id, { status: "packed", ...payload });
};

// ✅ UPDATED: Use bulk dispatch endpoint
export const markDispatched = async (id, payload = {}) => {
  try {
    const dispatchPayload = {
      orderIds: [id],
      courier: payload.courier || "Default Courier",
      dispatchNote: payload.note || payload.dispatchNote || ""
    };
    const { data } = await api.post(`/orders/dispatch`, dispatchPayload);
    return { ok: true, data: { results: data?.results || data } };
  } catch (e) {
    // fallback via generic status
    return updateStatus(id, { status: "shipped", ...payload });
  }
};

// ✅ UPDATED: Bulk dispatch for multiple orders
export const bulkDispatch = async (orderIds, payload = {}) => {
  try {
    const dispatchPayload = {
      orderIds,
      courier: payload.courier || "Default Courier", 
      dispatchNote: payload.note || payload.dispatchNote || ""
    };
    const { data } = await api.post(`/orders/dispatch`, dispatchPayload);
    return { ok: true, data: data?.results || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const markDelivered = async (id, payload = {}) => {
  return updateStatus(id, { status: "delivered", ...payload });
};

// ✅ UPDATED: Use correct cancel endpoint
export const cancel = async (id, payload = {}) => {
  try {
    const { data } = await api.delete(`/orders/${id}`, { data: payload });
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export const markReturned = async (id, payload = {}) => {
  return updateStatus(id, { status: "returned", ...payload });
};

/* -------------------- NEW: Payment Functions -------------------- */

// ✅ NEW: Update Payment Status
export const updatePayment = async (id, paymentPayload) => {
  try {
    const { data } = await api.put(`/orders/${id}/payment`, paymentPayload);
    return { ok: true, data: { order: data?.data || pickOrder(data) } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- NEW: Bulk Operations -------------------- */

// ✅ NEW: Bulk Update Orders
export const bulkUpdate = async (orderIds, status, note = "") => {
  try {
    const payload = { orderIds, status, note };
    const { data } = await api.put(`/orders/bulk`, payload);
    return { ok: true, data: data?.results || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* ------------------ Invoice & Bills ----------------- */

// ✅ NEW: Get Brand-wise Bill
// ✅ REPLACE THIS FUNCTION:
export const getBrandBill = async (orderId, brand, sellerUserId) => {
  try {
    const params = { brand, sellerUserId };
    const { data } = await api.get(`/orders/${orderId}/brand-bill`, { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};


export const downloadInvoice = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}/invoice`);
    const url = data?.url || data?.invoice?.url;
    if (!url) throw new Error("Invoice URL not available");
    return { ok: true, data: { url } };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- NEW: Analytics & Reporting -------------------- */

// ✅ NEW: Order Analytics
export const getOrderAnalytics = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/analytics", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ✅ NEW: Sales Report
export const getSalesReport = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/reports/sales", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- NEW: Advanced Filtering -------------------- */

// ✅ NEW: Get orders with advanced filters
export const getOrdersFiltered = async (filters = {}) => {
  try {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      status: filters.status || "",
      paymentStatus: filters.paymentStatus || "",
      dateFrom: filters.dateFrom || "",
      dateTo: filters.dateTo || "",
      buyerId: filters.buyerId || "",
      sellerId: filters.sellerId || ""
    };
    
    const { data } = await api.get("/orders/my", { params });
    return { ok: true, data: data?.data || data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/* -------------------- Utility Functions -------------------- */

// ✅ NEW: Format order for display
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



// ✅ NEW: Get order status color
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
  // place + read
  placeOrder,
  list,
  getMyOrders, // ✅ NEW
  listByBuyer,
  getById,
  getBuyerOrderById,
  getOrdersFiltered, // ✅ NEW
  
  // dashboards
  getSellerDashboard, // ✅ NEW
  getSellerEarnings, // ✅ NEW
  getStaffDashboard, // ✅ NEW
  getStaffBuyers, // ✅ NEW
  
  // status management
  updateStatus,
  markPacked,
  markDispatched,
  markDelivered,
  cancel,
  markReturned,
  
  // bulk operations
  bulkUpdate, // ✅ NEW
  bulkDispatch, // ✅ NEW
  
  // payment
  updatePayment, // ✅ NEW
  
  // bills & invoices
  getBrandBill, // ✅ NEW
  downloadInvoice,
  
  // analytics
  getOrderAnalytics, // ✅ NEW
  getSalesReport, // ✅ NEW
  
  // utilities
  formatOrder, // ✅ NEW
  getStatusColor, // ✅ NEW
  parseError
};