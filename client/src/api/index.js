import axios from "axios";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { store } from "../redux/store";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api/",
  timeout: 45000,
});

// Attach auth token to every request automatically
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Show error toast on failed responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "Something went wrong";
    store.dispatch(openSnackbar({ message: msg, severity: "error" }));
    return Promise.reject(error);
  }
);

// Attach Authorization header only when token exists
const withAuth = async (requestFn) => {
  const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
  if (!token) {
    store.dispatch(openSnackbar({ message: "Please sign in to continue", severity: "warning" }));
    return Promise.reject(new Error("Authentication required"));
  }
  return requestFn(token);
};

// ── Fast 0ms API Caching Layer (5-Minute TTL) ─────────────────────
const apiCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes

const cachedGet = async (cacheKey, fetchFn) => {
  const cached = apiCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    // Return cached response in 0ms & revalidate in background (Stale-While-Revalidate)
    fetchFn().then((res) => {
      apiCache.set(cacheKey, { timestamp: Date.now(), data: res });
    }).catch(() => {});
    return cached.data;
  }

  const res = await fetchFn();
  apiCache.set(cacheKey, { timestamp: now, data: res });
  return res;
};

// Invalidation helper on mutations
export const invalidateCache = (keyPattern) => {
  if (!keyPattern) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.includes(keyPattern)) {
      apiCache.delete(key);
    }
  }
};

// ── Auth ──────────────────────────────────────────────────────
export const UserSignUp = (data) => API.post("/user/signup", data);
export const UserSignIn = (data) => API.post("/user/signin", data);

// ── Food / Products ───────────────────────────────────────────
export const getAllProducts = (filter) =>
  cachedGet(`products_${filter || ""}`, () => API.get(`/food?${filter || ""}`));

export const getPopularProducts = () =>
  cachedGet("products_popular", () => API.get("/food?popular=true"));

export const getProductDetails = (id) =>
  cachedGet(`product_${id}`, () => API.get(`/food/${id}`));

// ── Cart ──────────────────────────────────────────────────────
export const getCart = () =>
  cachedGet("user_cart", () =>
    withAuth((token) => API.get("/user/cart", { headers: { Authorization: `Bearer ${token}` } }))
  );

export const addToCart = async (data) => {
  invalidateCache("user_cart");
  return withAuth((token) => API.post("/user/cart", data, { headers: { Authorization: `Bearer ${token}` } }));
};

export const deleteFromCart = async (data) => {
  invalidateCache("user_cart");
  return withAuth((token) => API.patch("/user/cart", data, { headers: { Authorization: `Bearer ${token}` } }));
};

// ── Favourites ────────────────────────────────────────────────
export const getFavourite = () =>
  cachedGet("user_fav", () =>
    withAuth((token) => API.get("/user/favorite", { headers: { Authorization: `Bearer ${token}` } }))
  );

export const addToFavourite = async (data) => {
  invalidateCache("user_fav");
  return withAuth((token) => API.post("/user/favorite", data, { headers: { Authorization: `Bearer ${token}` } }));
};

export const deleteFromFavourite = async (data) => {
  invalidateCache("user_fav");
  return withAuth((token) => API.patch("/user/favorite", data, { headers: { Authorization: `Bearer ${token}` } }));
};

// ── Restaurants ───────────────────────────────────────────────
export const getAllRestaurants = () =>
  cachedGet("restaurants_all", () => API.get("/restaurant"));

export const getNearbyRestaurants = (params = {}) => {
  const queryStr = new URLSearchParams(params).toString();
  return cachedGet(`restaurants_nearby_${queryStr}`, () => API.get(`/restaurant/nearby?${queryStr}`));
};

export const getRestaurantDetails = (id) =>
  cachedGet(`restaurant_${id}`, () => API.get(`/restaurant/${id}`));

// ── Orders ────────────────────────────────────────────────────
export const placeOrder = async (data) => {
  invalidateCache("user_cart");
  invalidateCache("user_orders");
  return withAuth((token) => API.post("/user/order", data, { headers: { Authorization: `Bearer ${token}` } }));
};

export const getOrders = () =>
  cachedGet("user_orders", () =>
    withAuth((token) => API.get("/user/order", { headers: { Authorization: `Bearer ${token}` } }))
  );

export default API;
