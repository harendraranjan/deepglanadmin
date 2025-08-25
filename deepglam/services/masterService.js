import api from "./api";
const parseError = (e) => e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong";

/** HSN */
export const createHSN = async (payload) => {
  try { const { data } = await api.post("/master/hsn", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};
export const getHSNs = async (params = {}) => {
  try { const { data } = await api.get("/master/hsn", { params }); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

/** Location */
export const upsertLocation = async (payload) => {
  try { const { data } = await api.post("/master/location", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};
export const getLocation = async (pincode) => {
  try { const { data } = await api.get(`/master/location/${pincode}`); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

/** Profit % */
export const setProfit = async (payload) => {
  try { const { data } = await api.post("/master/profit", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};
export const getProfits = async () => {
  try { const { data } = await api.get("/master/profit"); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

/** Banner */
export const createBanner = async (payload) => {
  try { const { data } = await api.post("/master/banner", payload); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};
export const getBanners = async () => {
  try { const { data } = await api.get("/master/banner"); return { ok: true, data }; }
  catch (e) { return { ok: false, error: parseError(e) }; }
};

export default {
  createHSN, getHSNs,
  upsertLocation, getLocation,
  setProfit, getProfits,
  createBanner, getBanners,
};
