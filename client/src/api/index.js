import axios from "axios";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { store } from "../redux/store";

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction ? "/api/" : (process.env.REACT_APP_API_URL || "/api/");

const API = axios.create({
  baseURL,
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
  const token = localStorage.getItem("foodeli-app-token");
  if (!token) {
    store.dispatch(openSnackbar({ message: "Please sign in to continue", severity: "warning" }));
    return Promise.reject(new Error("Authentication required"));
  }
  return requestFn(token);
};

// ── Auth ──────────────────────────────────────────────────────
export const UserSignUp = (data) => API.post("/user/signup", data);
export const UserSignIn = (data) => API.post("/user/signin", data);

// ── Food / Products ───────────────────────────────────────────
export const getAllProducts = (filter) => API.get(`/food?${filter || ""}`);
export const getPopularProducts = () => API.get("/food?popular=true");
export const getProductDetails = (id) => API.get(`/food/${id}`);

// ── Cart ──────────────────────────────────────────────────────
export const getCart = () =>
  withAuth((token) => API.get("/user/cart", { headers: { Authorization: `Bearer ${token}` } }));

export const addToCart = (data) =>
  withAuth((token) => API.post("/user/cart", data, { headers: { Authorization: `Bearer ${token}` } }));

export const deleteFromCart = (data) =>
  withAuth((token) => API.patch("/user/cart", data, { headers: { Authorization: `Bearer ${token}` } }));

// ── Favourites ────────────────────────────────────────────────
export const getFavourite = () =>
  withAuth((token) => API.get("/user/favorite", { headers: { Authorization: `Bearer ${token}` } }));

export const addToFavourite = (data) =>
  withAuth((token) => API.post("/user/favorite", data, { headers: { Authorization: `Bearer ${token}` } }));

export const deleteFromFavourite = (data) =>
  withAuth((token) => API.patch("/user/favorite", data, { headers: { Authorization: `Bearer ${token}` } }));

// ── Restaurants ───────────────────────────────────────────────
export const getAllRestaurants = () => API.get("/restaurant");

export const getNearbyRestaurants = (params = {}) =>
  API.get(`/restaurant/nearby?${new URLSearchParams(params).toString()}`);

export const getRestaurantDetails = (id) => API.get(`/restaurant/${id}`);

// ── Orders ────────────────────────────────────────────────────
export const placeOrder = (data) =>
  withAuth((token) => API.post("/user/order", data, { headers: { Authorization: `Bearer ${token}` } }));

export const getOrders = () =>
  withAuth((token) => API.get("/user/order", { headers: { Authorization: `Bearer ${token}` } }));

export default API;
