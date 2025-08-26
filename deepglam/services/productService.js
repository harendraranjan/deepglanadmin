// services/productService.js
import api from "./api";

/** Reuse the same error normalizer style as authService */
const parseError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  "Something went wrong";

/* ------------------------------------------------------------------ */
/*                            PUBLIC API                               */
/*  Matches your server/routes/product.routes.js endpoints:             */
/*   POST   /products                         -> createProduct          */
/*   GET    /products/disapproved             -> getDisapproved         */
/*   PUT    /products/:id                     -> updateProduct          */
/*   DELETE /products/:id                     -> deleteProduct          */
/*   GET    /products                         -> list (with filters)    */
/*   GET    /products/:id                     -> getById                */
/*   PUT    /products/approve/:id             -> approve                */
/*   POST   /products/clone/:id               -> clone                  */
/* ------------------------------------------------------------------ */

/** Create product (JSON payload). Use this when you're not uploading files. */
export const createProduct = async (payload) => {
  try {
    const { data } = await api.post("/products", payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/**
 * Create product with images (multipart form-data).
 * Pass either:
 *  - files: array of { uri, name, type } or an array of File/Blob (on web)
 *  - fields: object with the rest of your product fields
 * Example:
 *  await createProductMultipart({
 *     fields: { productname: 'Shirt', gender: 'men', ... },
 *     files: [{ uri, name: 'img1.jpg', type: 'image/jpeg' }]
 *  })
 */
export const createProductMultipart = async ({ fields = {}, files = [] }) => {
  try {
    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((item) => form.append(`${k}[]`, String(item)));
      } else if (v !== undefined && v !== null) {
        form.append(k, String(v));
      }
    });
    files.forEach((file) => {
      form.append("images", file); // backend: multer.array('images')
    });

    const { data } = await api.post("/products", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Get products for logged-in seller/user */
export const getMyProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products/my", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};


/** Get only disapproved products */
export const getDisapprovedProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products/disapproved", { params });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Update product (JSON) */
export const updateProduct = async (id, payload) => {
  try {
    const { data } = await api.put(`/products/${id}`, payload);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Delete product */
export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/products/${id}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/**
 * List products with optional filters/sorting/pagination.
 * Supported params (frontend side):
 *  - gender: 'men' | 'women' | 'all' (we omit when 'all')
 *  - colors: array or csv string
 *  - minPrice, maxPrice: numbers
 *  - search, sort, page, limit, seller, mainCategory, subCategory, productType
 *
 * Your backend controller should read these from req.query.
 */
export const list = async (params = {}) => {
  try {
    const q = normalizeListParams(params);
    const { data } = await api.get("/products", { params: q });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Get single product by id */
export const getById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Approve product */
export const approve = async (id) => {
  try {
    const { data } = await api.put(`/products/approve/${id}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/** Clone product */
export const clone = async (id) => {
  try {
    const { data } = await api.post(`/products/clone/${id}`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: parseError(err) };
  }
};

/* ------------------------------------------------------------------ */
/*                             HELPERS                                 */
/* ------------------------------------------------------------------ */

/** Make sure we send clean query to backend */
function normalizeListParams(p) {
  const out = { ...p };

  // gender: omit 'all'
  if (out.gender === "all") delete out.gender;

  // colors: allow array or csv
  if (Array.isArray(out.colors)) {
    out.colors = out.colors.join(",");
  }

  // price ranges: keep only valid numbers
  if (out.minPrice == null) delete out.minPrice;
  if (out.maxPrice == null) delete out.maxPrice;

  // empty strings → remove
  Object.keys(out).forEach((k) => {
    if (out[k] === "" || out[k] === undefined || out[k] === null) delete out[k];
  });

  return out;
}

export const getAllProducts = async (params = {}) => {
  try { const { data } = await api.get("/products", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export const approveProduct = async (id) => {
  try { const { data } = await api.put(`/products/approve/${id}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default {
  createProduct,
  createProductMultipart,
  getDisapprovedProducts,
  updateProduct,
  deleteProduct,
  getMyProducts,
  list,
  getById,
  approve,
  clone,
  getAllProducts,
  approveProduct,
};
