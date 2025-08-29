// services/orderService.js - Enhanced version with your existing API
import api from "./api";

// ---- helpers ----
export const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

// Optional: add per-request timeout
async function withTimeout(promise, ms = 15000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort("Request timeout"), ms);
  try {
    const res = await promise(controller.signal);
    return res;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Maps a product to order line item format
 * - Robust sellerId resolution from product.seller?._id | product.sellerId | product.seller
 * @param {Object} product - Product object from API
 * @param {number} quantity - Quantity to order
 * @returns {Object} - Formatted line item
 */
export const mapLine = (product, quantity = 1) => {
  if (!product || !product._id) {
    throw new Error("Invalid product data");
  }

  // Normalize sellerId from different shapes
  const rawSeller =
    product?.seller?._id || // populated object
    product?.sellerId || // explicit sellerId
    product?.seller || // plain string id
    null;

  const sellerId = rawSeller ? String(rawSeller) : null;

  return {
    productId: String(product._id),
    sellerId,                 // normalized seller id
    seller: sellerId,         // mirror (some backends read 'seller')
    name: product.productname || product.name || "Unknown Product",
    hsn: product.hsnCode || product.hsn || "",
    price: Number(product.finalPrice ?? product.mrp ?? 0),
    quantity: Math.max(1, Number(quantity)),
    discountPercent: Number(product.discountPercentage ?? 0),
    brand: product.brand || "Unknown",
  };
};

/**
 * Calculates order totals and amounts
 * @param {Array} lines - Array of line items
 * @param {Object} options - Additional options (coupon, shipping, etc.)
 * @returns {Object} - Calculated amounts
 */
export const calculateOrderTotals = (lines, options = {}) => {
  const {
    couponAmount = 0,
    shipping = 100,
    roundOff = -0.5,
    gstRate = 5,
  } = options;

  let totalAmount = 0;
  let discountAmount = 0;
  const brandBreakdown = {};

  // Calculate totals from line items
  lines.forEach((line) => {
    const lineTotal = Number(line.price) * Number(line.quantity);
    const lineDiscount = (lineTotal * Number(line.discountPercent || 0)) / 100;

    totalAmount += lineTotal;
    discountAmount += lineDiscount;

    // Build brand breakdown
    const brand = line.brand || "Unknown";
    brandBreakdown[brand] = (brandBreakdown[brand] || 0) + lineTotal;
  });

  // Add coupon discount
  discountAmount += Number(couponAmount);

  // Calculate GST on discounted amount
  const taxableAmount = totalAmount - discountAmount;
  const gstAmount = (taxableAmount * Number(gstRate)) / 100;

  // Final amount calculation
  const finalAmount =
    totalAmount - discountAmount + gstAmount + Number(shipping) + Number(roundOff);

  const round2 = (n) => Math.round(n * 100) / 100;

  return {
    totalAmount: round2(totalAmount),
    discountAmount: round2(discountAmount),
    gstAmount: round2(gstAmount),
    finalAmount: round2(finalAmount),
    brandBreakdown,
  };
};

/**
 * Builds complete order payload
 * @param {Object} params - { roleId, user, lines, address, staffCode, options }
 * @returns {Object} - Complete order payload
 */
export const buildOrderPayload = (params) => {
  const { roleId, user, lines = [], address = {}, staffCode = "", options = {} } = params;

  if (!user || !user._id) {
    throw new Error("User information is required");
  }
  if (!lines.length) {
    throw new Error("At least one product is required");
  }

  // Calculate totals
  const totals = calculateOrderTotals(lines, options);

  // Build the payload (Postman-like)
  const payload = {
    // Use roleId (Buyer._id) when available; fallback to user._id (not recommended)
    buyerId: roleId || user._id,
    buyerPhone: user.phone || "",

    // Address information
    pincode: address.pincode || user.pincode || "",
    city: address.city || user.city || "",
    state: address.state || user.state || "",
    country: address.country || user.country || "India",
    fullAddress: address.fullAddress || user.fullAddress || "",

    // Staff code (if applicable)
    staffCode: staffCode || "",

    // Products array (each line includes sellerId/seller & productId)
    products: lines,

    // Pricing details (raw inputs)
    gstRate: Number(options.gstRate ?? 5),
    couponAmount: Number(options.couponAmount ?? 0),
    shipping: Number(options.shipping ?? 100),
    roundOff: Number(options.roundOff ?? -0.5),

    // Calculated amounts
    ...totals,
  };

  return payload;
};

/**
 * Default address for orders (fallback)
 */
export const getDefaultAddress = (user) => {
  return {
    pincode: user?.pincode || "110001",
    city: user?.city || "New Delhi",
    state: user?.state || "Delhi",
    country: user?.country || "India",
    fullAddress:
      user?.fullAddress || `${user?.name || "User"} Address, ${user?.city || "New Delhi"}`,
  };
};

// ---------- ORDERS ----------
/**
 * POST /orders
 * payload = your full order object (buyerId, address, products, totals, etc.)
 */
export const placeOrder = async (payload, { timeoutMs = 15000 } = {}) => {
  try {
    // Safety: ensure each product line has sellerId/seller
    if (Array.isArray(payload?.products)) {
      for (const l of payload.products) {
        if (!l.sellerId && l.seller) l.sellerId = l.seller;
        if (!l.seller && l.sellerId) l.seller = l.sellerId;
      }
    }

    // Some backends read "items" instead of "products" — mirror to be safe
    if (payload.products && !payload.items) payload.items = payload.products;

    const { data } = await withTimeout(
      (signal) => api.post("/orders", payload, { signal }),
      timeoutMs
    );
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/**
 * Quick order function - creates order from product and user
 * NOTE: signature kept as (product, roleId, user, quantity, options)
 * @param {Object} product - Product to order
 * @param {string|null} roleId - BuyerId from AuthContext (preferred)
 * @param {Object} user - User placing the order
 * @param {number|null} quantity - Quantity to order (defaults to MOQ or 1)
 * @param {Object} options - Additional options
 * @returns {Promise} - Order placement result
 */
export const quickOrder = async (product, roleId, user, quantity = null, options = {}) => {
  try {
    // Use MOQ if quantity not specified
    const orderQuantity = quantity || product?.MOQ || 1;

    // Create line item
    const line = mapLine(product, orderQuantity);

    // Validate seller
    if (!line.sellerId) {
      throw new Error("Seller not found for this product");
    }

    // Get default address if not provided
    const address = options.address || getDefaultAddress(user);

    // Build payload
    const payload = buildOrderPayload({
      roleId, // buyerId from Auth
      user,
      lines: [line],
      address,
      staffCode: options.staffCode || "",
      options,
    });

    // Place order
    return await placeOrder(payload);
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Failed to create order",
    };
  }
};

/**
 * GET /orders  (admin/staff filters supported)
 * params example: { page, limit, status, buyerId, sellerId, from, to, sort }
 */
export const list = async (params = {}) => {
  try {
    const { data } = await api.get("/orders", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** GET /orders/mine  (buyer's own orders) */
export const listMy = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/mine", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** GET /orders/seller (seller's orders) */
export const listBySeller = async (params = {}) => {
  try {
    const { data } = await api.get("/orders/seller", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** GET /orders/:id */
export const getById = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** PUT /orders/status/:id  (confirmed → dispatched → delivered, etc.) */
export const updateStatus = async (id, payload) => {
  try {
    const { data } = await api.put(`/orders/status/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** PUT /orders/payment/:id  (paid/unpaid/partial) */
export const updatePaymentStatus = async (id, payload) => {
  try {
    const { data } = await api.put(`/orders/payment/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** PUT /orders/return/:id  (buyer or staff triggers return request/update) */
export const requestReturn = async (id, payload) => {
  try {
    const { data } = await api.put(`/orders/return/${id}`, payload);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// ---------- BILLS / INVOICES ----------
/** GET /orders/:id/invoice  -> returns { pdfUrl } or file stream (backend dependent) */
export const getInvoice = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}/invoice`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** If server sends raw PDF stream: GET blob and let app save/share */
export const downloadInvoice = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}/invoice`, {
      responseType: "blob",
    });
    return { ok: true, data }; // handle saving with FileSystem/Share in RN
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

// Default export with all functions
const orderService = {
  // Order operations
  placeOrder,
  list,
  listMy,
  listBySeller,
  getById,
  updateStatus,
  updatePaymentStatus,
  requestReturn,

  // Invoice operations
  getInvoice,
  downloadInvoice,

  // Utility functions
  quickOrder,
  mapLine,
  buildOrderPayload,
  calculateOrderTotals,
  getDefaultAddress,
  parseError,
};

export default orderService;
