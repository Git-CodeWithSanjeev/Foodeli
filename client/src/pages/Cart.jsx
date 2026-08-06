import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import {
  DeleteOutline,
  FavoriteBorder,
  FavoriteRounded,
  ShoppingCartOutlined,
  ArrowForward,
  LocationOn,
  Phone,
  Email as EmailIcon,
  Person,
} from "@mui/icons-material";
import {
  addToCart,
  deleteFromCart,
  getCart,
  placeOrder,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
} from "../api";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

/* ─────────────────────────────────────────────────────────────
   Inline styles (no extra CSS file needed)
───────────────────────────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#f8f8f8",
    paddingBottom: 60,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "18px 0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1c1c1c",
    margin: 0,
  },
  badge: {
    background: "#e23744",
    color: "#fff",
    borderRadius: 12,
    padding: "2px 9px",
    fontSize: 13,
    fontWeight: 700,
  },
  wrap: {
    maxWidth: 1200,
    margin: "32px auto",
    padding: "0 24px",
    display: "flex",
    gap: 28,
    alignItems: "flex-start",
  },
  left: { flex: 2, display: "flex", flexDirection: "column", gap: 14 },
  right: { flex: 1, display: "flex", flexDirection: "column", gap: 20 },
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e8e8e8",
    overflow: "hidden",
  },
  cartRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    transition: "background .15s",
  },
  img: {
    width: 72,
    height: 72,
    objectFit: "cover",
    borderRadius: 8,
    flexShrink: 0,
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1c1c1c",
    marginBottom: 3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemDesc: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  itemPrice: { fontSize: 14, fontWeight: 700, color: "#e23744" },
  counter: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    border: "1.5px solid #e23744",
    borderRadius: 6,
    overflow: "hidden",
    flexShrink: 0,
  },
  counterBtn: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
    color: "#e23744",
    transition: "background .12s",
  },
  counterQty: {
    minWidth: 34,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#1c1c1c",
    background: "#fff8f8",
  },
  lineTotal: {
    width: 72,
    textAlign: "right",
    fontWeight: 700,
    fontSize: 14,
    color: "#1c1c1c",
    flexShrink: 0,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1c1c1c",
    padding: "18px 20px 10px",
    borderBottom: "1px solid #f0f0f0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    fontSize: 14,
    color: "#555",
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 20px",
    fontSize: 17,
    fontWeight: 700,
    color: "#1c1c1c",
    borderTop: "2px solid #eee",
  },
  formGroup: {
    padding: "10px 20px",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#666",
    marginBottom: 4,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #e0e0e0",
    borderRadius: 8,
    fontSize: 14,
    color: "#1c1c1c",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
    background: "#fafafa",
  },
  inputFocus: {
    borderColor: "#e23744",
    background: "#fff",
  },
  row2: { display: "flex", gap: 12 },
  placeBtn: {
    margin: "20px",
    padding: "14px",
    width: "calc(100% - 40px)",
    background: "linear-gradient(135deg, #e23744, #c0392b)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 4px 16px rgba(226,55,68,0.3)",
    transition: "all .2s",
    letterSpacing: "0.3px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    borderRadius: 12,
  },
  emptyIcon: { fontSize: 72, color: "#e0e0e0", marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: "#333", margin: "0 0 8px" },
  emptySub: { fontSize: 14, color: "#888", margin: "0 0 24px" },
  browseBtn: {
    display: "inline-block",
    padding: "12px 28px",
    background: "#e23744",
    color: "#fff",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontSize: 15,
  },
  loginBox: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    borderRadius: 12,
  },
  savings: {
    background: "#eaffea",
    borderRadius: 8,
    padding: "10px 20px",
    margin: "0 20px 14px",
    fontSize: 13,
    color: "#27ae60",
    fontWeight: 600,
  },
};

/* ─────────────────────────────────────────────────────────────
   Helper: FocusInput (manages focus border color inline)
───────────────────────────────────────────────────────────── */
const FInput = ({ label, icon: Icon, value, onChange, placeholder, type = "text", required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={s.formGroup}>
      <label style={s.label}>
        {label} {required && <span style={{ color: "#e23744" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "#e23744" : "#aaa",
              fontSize: 18,
              transition: "color .2s",
            }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            ...s.input,
            ...(focused ? s.inputFocus : {}),
            paddingLeft: Icon ? 36 : 12,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Cart Component
───────────────────────────────────────────────────────────── */
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [favLoading, setFavLoading] = useState({});
  const [reload, setReload] = useState(0);
  const [delivery, setDelivery] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const token =
    localStorage.getItem("foodeli-app-token") ||
    localStorage.getItem("krist-app-token");

  /* ── Fetch cart ── */
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getCart();
      // Filter out items with null product (deleted food items)
      const valid = (res.data || []).filter(
        (item) => item && item.product && item.product._id
      );
      setProducts(valid);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ── Fetch favourites ── */
  const fetchFavourites = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getFavourite();
      const map = {};
      (res.data || []).forEach((item) => {
        const id = item._id || item.product?._id;
        if (id) map[id] = true;
      });
      setFavorites(map);
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    fetchCart();
    fetchFavourites();
  }, [fetchCart, fetchFavourites, reload]);

  /* ── Price calculations ── */
  const subtotal = products.reduce(
    (sum, item) => sum + (item.quantity || 1) * (item.product?.price?.org || 0),
    0
  );
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const discount = Math.floor(subtotal * 0.05); // 5% loyalty discount
  const total = subtotal + deliveryFee - discount;

  /* ── Increase quantity ── */
  const handleIncrease = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      setReload((r) => r + 1);
    } catch (err) {
      dispatch(openSnackbar({ message: err?.response?.data?.message || "Error updating cart", severity: "error" }));
    }
  };

  /* ── Decrease / remove ── */
  const handleDecrease = async (productId, currentQty) => {
    try {
      if (currentQty <= 1) {
        // Remove entirely
        await deleteFromCart({ productId, quantity: null });
        dispatch(openSnackbar({ message: "Item removed from cart", severity: "info" }));
      } else {
        await deleteFromCart({ productId, quantity: 1 });
      }
      setReload((r) => r + 1);
    } catch (err) {
      dispatch(openSnackbar({ message: "Error updating cart", severity: "error" }));
    }
  };

  /* ── Remove entirely ── */
  const handleRemove = async (productId) => {
    try {
      await deleteFromCart({ productId, quantity: null });
      dispatch(openSnackbar({ message: "Item removed from cart", severity: "success" }));
      setReload((r) => r + 1);
    } catch (err) {
      dispatch(openSnackbar({ message: "Error removing item", severity: "error" }));
    }
  };

  /* ── Toggle favourite ── */
  const handleFavourite = async (productId) => {
    if (!token) {
      dispatch(openSnackbar({ message: "Please sign in to save favourites", severity: "warning" }));
      return;
    }
    try {
      setFavLoading((prev) => ({ ...prev, [productId]: true }));
      if (favorites[productId]) {
        await deleteFromFavourite({ productId });
        setFavorites((prev) => ({ ...prev, [productId]: false }));
        dispatch(openSnackbar({ message: "Removed from favourites", severity: "info" }));
      } else {
        await addToFavourite({ productId });
        setFavorites((prev) => ({ ...prev, [productId]: true }));
        dispatch(openSnackbar({ message: "Added to favourites ♥", severity: "success" }));
      }
    } catch (_) {
      dispatch(openSnackbar({ message: "Error updating favourites", severity: "error" }));
    } finally {
      setFavLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  /* ── Place order ── */
  const handlePlaceOrder = async () => {
    if (!delivery.firstName || !delivery.lastName || !delivery.address || !delivery.phone || !delivery.email) {
      dispatch(openSnackbar({ message: "Please fill all delivery details", severity: "error" }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(delivery.email)) {
      dispatch(openSnackbar({ message: "Please enter a valid email address", severity: "error" }));
      return;
    }

    if (delivery.phone.length < 10) {
      dispatch(openSnackbar({ message: "Please enter a valid phone number", severity: "error" }));
      return;
    }

    try {
      setOrdering(true);
      const orderPayload = {
        products: products.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        address: `${delivery.firstName} ${delivery.lastName}, ${delivery.address}, Ph: ${delivery.phone}, Email: ${delivery.email}`,
        totalAmount: total.toFixed(2),
      };
      await placeOrder(orderPayload);
      dispatch(openSnackbar({ message: "🎉 Order placed successfully!", severity: "success" }));
      navigate("/orders");
    } catch (err) {
      dispatch(openSnackbar({
        message: err?.response?.data?.message || "Failed to place order. Please try again.",
        severity: "error",
      }));
    } finally {
      setOrdering(false);
    }
  };

  /* ── Not signed in ── */
  if (!token) {
    return (
      <div style={s.page}>
        <div style={s.loginBox}>
          <ShoppingCartOutlined style={{ fontSize: 72, color: "#ddd" }} />
          <h2 style={s.emptyTitle}>Please Sign In</h2>
          <p style={s.emptyTitle}>Sign in to view your cart and place orders</p>
          <button style={s.browseBtn} onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <ShoppingCartOutlined style={{ color: "#e23744", fontSize: 28 }} />
          <h1 style={s.headerTitle}>Your Cart</h1>
          {products.length > 0 && (
            <span style={s.badge}>{products.length} item{products.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <CircularProgress style={{ color: "#e23744" }} />
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px" }}>
          <div style={s.emptyState}>
            <ShoppingCartOutlined style={s.emptyIcon} />
            <h2 style={s.emptyTitle}>Your cart is empty</h2>
            <p style={s.emptyTitle}>Add items from a restaurant to get started</p>
            <button style={s.browseBtn} onClick={() => navigate("/")}>
              Browse Restaurants
            </button>
          </div>
        </div>
      ) : (
        <div style={s.wrap}>
          {/* ── Left: Cart items ── */}
          <div style={s.left}>
            <div style={s.card}>
              <div style={s.sectionTitle}>Order Items</div>
              {products.map((item) => {
                const p = item.product;
                const lineTotal = (item.quantity * (p?.price?.org || 0)).toFixed(2);
                const isFav = !!favorites[p?._id];
                return (
                  <div key={p?._id} style={s.cartRow}>
                    <img
                      src={p?.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
                      alt={p?.name}
                      style={s.img}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"; }}
                    />

                    <div style={s.itemInfo}>
                      <div style={s.itemName}>{p?.name}</div>
                      <div style={s.itemDesc}>{p?.desc?.slice(0, 60)}{p?.desc?.length > 60 ? "…" : ""}</div>
                      <div style={s.itemPrice}>₹{p?.price?.org}</div>
                    </div>

                    {/* Quantity counter */}
                    <div style={s.counter}>
                      <button
                        style={s.counterBtn}
                        onClick={() => handleDecrease(p?._id, item.quantity)}
                        title="Decrease"
                      >
                        −
                      </button>
                      <div style={s.counterQty}>{item.quantity}</div>
                      <button
                        style={s.counterBtn}
                        onClick={() => handleIncrease(p?._id)}
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div style={s.lineTotal}>₹{lineTotal}</div>

                    <div style={s.actions}>
                      {/* Favourite */}
                      <button
                        style={s.iconBtn}
                        onClick={() => handleFavourite(p?._id)}
                        title={isFav ? "Remove from favourites" : "Add to favourites"}
                        disabled={!!favLoading[p?._id]}
                      >
                        {favLoading[p?._id] ? (
                          <CircularProgress size={18} style={{ color: "#e23744" }} />
                        ) : isFav ? (
                          <FavoriteRounded style={{ color: "#e23744", fontSize: 22 }} />
                        ) : (
                          <FavoriteBorder style={{ color: "#aaa", fontSize: 22 }} />
                        )}
                      </button>
                      {/* Delete */}
                      <button
                        style={s.iconBtn}
                        onClick={() => handleRemove(p?._id)}
                        title="Remove item"
                      >
                        <DeleteOutline style={{ color: "#d0021b", fontSize: 22 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Summary + Delivery form ── */}
          <div style={s.right}>
            {/* Price summary */}
            <div style={s.card}>
              <div style={s.sectionTitle}>Price Details</div>
              <div style={s.summaryRow}>
                <span>Item Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Delivery Fee</span>
                <span style={{ color: deliveryFee === 0 ? "#27ae60" : undefined }}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div style={s.summaryRow}>
                  <span>Loyalty Discount (5%)</span>
                  <span style={{ color: "#27ae60" }}>−₹{discount}</span>
                </div>
              )}
              <div style={s.summaryTotal}>
                <span>Total to Pay</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={s.savings}>
                  🎉 You're saving ₹{discount + (deliveryFee === 0 ? 40 : 0)} on this order!
                </div>
              )}
            </div>

            {/* Delivery details */}
            <div style={s.card}>
              <div style={s.sectionTitle}>Delivery Details</div>
              <div style={s.row2}>
                <FInput
                  label="First Name"
                  icon={Person}
                  value={delivery.firstName}
                  onChange={(e) => setDelivery((d) => ({ ...d, firstName: e.target.value }))}
                  placeholder="Rahul"
                  required
                />
                <FInput
                  label="Last Name"
                  value={delivery.lastName}
                  onChange={(e) => setDelivery((d) => ({ ...d, lastName: e.target.value }))}
                  placeholder="Sharma"
                  required
                />
              </div>
              <FInput
                label="Email Address"
                icon={EmailIcon}
                type="email"
                value={delivery.email}
                onChange={(e) => setDelivery((d) => ({ ...d, email: e.target.value }))}
                placeholder="rahul@example.com"
                required
              />
              <FInput
                label="Phone Number"
                icon={Phone}
                type="tel"
                value={delivery.phone}
                onChange={(e) => setDelivery((d) => ({ ...d, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                placeholder="9876543210"
                required
              />
              <FInput
                label="Delivery Address"
                icon={LocationOn}
                value={delivery.address}
                onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))}
                placeholder="House/Flat, Street, Area, City"
                required
              />

              <button
                style={{
                  ...s.placeBtn,
                  opacity: ordering ? 0.75 : 1,
                  cursor: ordering ? "not-allowed" : "pointer",
                }}
                onClick={handlePlaceOrder}
                disabled={ordering}
              >
                {ordering ? (
                  <CircularProgress size={20} style={{ color: "#fff" }} />
                ) : (
                  <>
                    Place Order — ₹{total.toFixed(2)}
                    <ArrowForward style={{ fontSize: 20 }} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
