
import api from "./api";

const parseError = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Something went wrong";

/** POST /wishlist/:productId */
export const add = async (productId) => {
  try {
    const { data } = await api.post(`/wishlist/${productId}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** DELETE /wishlist/:productId */
export const remove = async (productId) => {
  try {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

/** GET /wishlist */
export const getMyWishlist = async (params = {}) => {
  try {
    const { data } = await api.get("/wishlist", { params });
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: parseError(e) };
  }
};

export default { add, remove, getMyWishlist };
