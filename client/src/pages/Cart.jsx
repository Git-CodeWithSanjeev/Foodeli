import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Modal } from "@mui/material";
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
  CheckCircle,
  Payment,
  LocalShipping,
  LocalOffer,
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
   Inline Styles - Clean, Responsive & Pixel-Perfect Layout
───────────────────────────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    paddingBottom: 80,
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    background: "#ffffff",
    borderBottom: "1px solid #eef0f2",
    padding: "18px 0",
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
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
    color: "#ffffff",
    borderRadius: 14,
    padding: "3px 11px",
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
    flexWrap: "wrap",
  },
  left: { flex: 2, minWidth: 320, display: "flex", flexDirection: "column", gap: 16 },
  right: { flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 20 },
  card: {
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid #e9ecef",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  cartRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 20px",
    borderBottom: "1px solid #f1f3f5",
    transition: "background .15s",
  },
  img: {
    width: 76,
    height: 76,
    objectFit: "cover",
    borderRadius: 10,
    flexShrink: 0,
    border: "1px solid #eee",
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1c1c1c",
    marginBottom: 4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemDesc: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
    lineHeight: 1.4,
  },
  itemPrice: { fontSize: 14, fontWeight: 700, color: "#e23744" },
  counter: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    border: "1.5px solid #e23744",
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  counterBtn: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
    color: "#e23744",
    transition: "background .12s",
  },
  counterQty: {
    minWidth: 36,
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
    fontSize: 15,
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
    padding: 6,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background .15s",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1c1c1c",
    padding: "18px 20px",
    borderBottom: "1px solid #f1f3f5",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    fontSize: 14,
    color: "#555",
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 20px",
    fontSize: 17,
    fontWeight: 700,
    color: "#1c1c1c",
    borderTop: "2px solid #f1f3f5",
  },
  formGroup: {
    padding: "10px 20px",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    marginBottom: 6,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    height: 48,
    padding: "14px 16px",
    border: "1.5px solid #dcdfe3",
    borderRadius: 10,
    fontSize: 15,
    color: "#1c1c1c",
    outline: "none",
    boxSizing: "border-box",
    transition: "all .2s ease",
    background: "#ffffff",
  },
  inputFocus: {
    borderColor: "#e23744",
    boxShadow: "0 0 0 3px rgba(226, 55, 68, 0.12)",
  },
  row2: {
    display: "flex",
    gap: 12,
    padding: "0 20px",
    flexWrap: "wrap",
  },
  placeBtn: {
    margin: "20px",
    padding: "16px",
    width: "calc(100% - 40px)",
    background: "linear-gradient(135deg, #e23744, #c0392b)",
    color: "#ffffff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 6px 20px rgba(226, 55, 68, 0.3)",
    transition: "all .2s ease",
    letterSpacing: "0.3px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#ffffff",
    borderRadius: 14,
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
  },
  emptyIcon: { fontSize: 72, color: "#e0e0e0", marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: "#333", margin: "0 0 8px" },
  emptySub: { fontSize: 14, color: "#888", margin: "0 0 24px" },
  browseBtn: {
    display: "inline-block",
    padding: "14px 32px",
    background: "#e23744",
    color: "#ffffff",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontSize: 15,
    boxShadow: "0 4px 14px rgba(226, 55, 68, 0.3)",
  },
  loginBox: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#ffffff",
    borderRadius: 14,
    maxWidth: 500,
    margin: "60px auto",
  },
  savings: {
    background: "#eaffea",
    borderRadius: 8,
    padding: "12px 20px",
    margin: "0 20px 14px",
    fontSize: 13,
    color: "#27ae60",
    fontWeight: 600,
  },
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    background: "#ffffff",
    borderRadius: 16,
    padding: 30,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    outline: "none",
  },
};

/* ─────────────────────────────────────────────────────────────
   Helper: Form Input Component (Clean Input Field)
───────────────────────────────────────────────────────────── */
const FInput = ({ label, icon: Icon, value, onChange, placeholder, type = "text", required, inputStyle = {} }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: "1 1 220px", minWidth: 0, width: "100%" }}>
      <label style={s.label}>
        {label} {required && <span style={{ color: "#e23744" }}>*</span>}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        {Icon && (
          <Icon
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "#e23744" : "#888",
              fontSize: 20,
              transition: "color .2s",
              pointerEvents: "none",
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
            paddingLeft: Icon ? 44 : 16,
            ...inputStyle,
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
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [favLoading, setFavLoading] = useState({});
  const [reload, setReload] = useState(0);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [delivery, setDelivery] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const PROMO_CODES = {
    FOODELI50: { discount: 50, desc: "₹50 Flat Discount" },
    WELCOME100: { discount: 100, desc: "₹100 Off on orders > ₹300", minOrder: 300 },
    FREEDEL: { discount: 40, desc: "Free Delivery Coupon", isFreeDel: true },
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const promo = PROMO_CODES[code];
    if (!promo) {
      dispatch(openSnackbar({ message: "Invalid code. Try FOODELI50, WELCOME100, or FREEDEL", severity: "error" }));
      return;
    }

    if (promo.minOrder && subtotal < promo.minOrder) {
      dispatch(openSnackbar({ message: `Order total must be at least ₹${promo.minOrder} for ${code}`, severity: "warning" }));
      return;
    }

    setAppliedPromo({ code, ...promo });
    dispatch(openSnackbar({ message: `🎉 Coupon ${code} applied successfully!`, severity: "success" }));
  };

  const token =
    localStorage.getItem("foodeli-app-token") ||
    localStorage.getItem("krist-app-token");

  // Auto-populate delivery details if logged in
  useEffect(() => {
    if (currentUser) {
      const nameParts = (currentUser.name || "").split(" ");
      setDelivery({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "9876543210",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  /* ── Fetch cart items ── */
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getCart();
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

  /* ── Remove item ── */
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

  /* ── REAL FUNCTIONALITY: Place Order ── */
  const handlePlaceOrder = async () => {
    if (!delivery.firstName || !delivery.address || !delivery.phone || !delivery.email) {
      dispatch(openSnackbar({ message: "Please fill in all required delivery details", severity: "error" }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(delivery.email)) {
      dispatch(openSnackbar({ message: "Please enter a valid email address", severity: "error" }));
      return;
    }

    if (delivery.phone.length < 10) {
      dispatch(openSnackbar({ message: "Please enter a valid 10-digit phone number", severity: "error" }));
      return;
    }

    try {
      setOrdering(true);
      const orderPayload = {
        products: products.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        address: `${delivery.firstName} ${delivery.lastName}, ${delivery.address}, Phone: ${delivery.phone}, Payment: ${paymentMethod}`,
        totalAmount: total.toFixed(2),
      };

      const res = await placeOrder(orderPayload);
      const createdOrder = res.data?.order || { _id: "ORD-" + Math.floor(100000 + Math.random() * 900000) };

      setCreatedOrderDetails(createdOrder);
      setProducts([]); // Clear local cart
      setOrderSuccessModal(true);
      dispatch(openSnackbar({ message: "🎉 Order placed successfully!", severity: "success" }));
    } catch (err) {
      console.error("Order placement error:", err);
      dispatch(openSnackbar({
        message: err?.response?.data?.message || "Failed to place order. Please try again.",
        severity: "error",
      }));
    } finally {
      setOrdering(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setOrderSuccessModal(false);
    navigate("/orders");
  };

  /* ── Not signed in ── */
  if (!token) {
    return (
      <div style={s.page}>
        <div style={s.loginBox}>
          <ShoppingCartOutlined style={{ fontSize: 72, color: "#e23744", marginBottom: 16 }} />
          <h2 style={s.emptyTitle}>Please Sign In</h2>
          <p style={s.emptySub}>Sign in to view your cart and place orders</p>
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
      ) : products.length === 0 && !orderSuccessModal ? (
        /* Empty Cart State */
        <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px" }}>
          <div style={s.emptyState}>
            <ShoppingCartOutlined style={s.emptyIcon} />
            <h2 style={s.emptyTitle}>Your cart is empty</h2>
            <p style={s.emptySub}>Explore top delivery restaurants and add delicious items</p>
            <button style={s.browseBtn} onClick={() => navigate("/")}>
              Browse Restaurants
            </button>
          </div>
        </div>
      ) : (
        <div style={s.wrap}>
          {/* ── Left Column: Cart Items ── */}
          <div style={s.left}>
            <div style={s.card}>
              <div style={s.sectionTitle}>
                <LocalShipping style={{ color: "#e23744" }} />
                Order Items ({products.length})
              </div>
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
                      }}
                    />

                    <div style={s.itemInfo}>
                      <div style={s.itemName}>{p?.name}</div>
                      <div style={s.itemDesc}>{p?.desc?.slice(0, 60)}{p?.desc?.length > 60 ? "…" : ""}</div>
                      <div style={s.itemPrice}>₹{p?.price?.org}</div>
                    </div>

                    {/* Quantity Selector */}
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
                      {/* Favorite Button */}
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

                      {/* Remove Button */}
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

          {/* ── Right Column: Summary & Delivery Details Form ── */}
          <div style={s.right}>
            {/* Promo Code Coupon Card */}
            <div style={s.card}>
              <div style={s.sectionTitle}>
                <LocalOffer style={{ color: "#e23744" }} />
                Apply Coupon / Promo Code
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Enter code (e.g. FOODELI50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{
                    background: "#e23744",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "0 18px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Apply
                </button>
              </div>
              {appliedPromo ? (
                <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: 6, marginTop: 10, fontSize: 13, fontWeight: 600 }}>
                  ✓ {appliedPromo.code} applied ({appliedPromo.desc})
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
                  Available codes: <strong>FOODELI50</strong> (₹50 OFF), <strong>WELCOME100</strong> (₹100 OFF), <strong>FREEDEL</strong> (Free Delivery)
                </div>
              )}
            </div>

            {/* Price Details Card */}
            <div style={s.card}>
              <div style={s.sectionTitle}>
                <Payment style={{ color: "#e23744" }} />
                Price Details
              </div>
              <div style={s.summaryRow}>
                <span>Item Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Delivery Fee</span>
                <span style={{ color: (deliveryFee === 0 || appliedPromo?.isFreeDel) ? "#27ae60" : undefined, fontWeight: (deliveryFee === 0 || appliedPromo?.isFreeDel) ? 700 : 500 }}>
                  {(deliveryFee === 0 || appliedPromo?.isFreeDel) ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div style={s.summaryRow}>
                  <span>Loyalty Discount (5%)</span>
                  <span style={{ color: "#27ae60", fontWeight: 600 }}>−₹{discount}</span>
                </div>
              )}
              {appliedPromo && !appliedPromo.isFreeDel && (
                <div style={s.summaryRow}>
                  <span>Coupon Discount ({appliedPromo.code})</span>
                  <span style={{ color: "#27ae60", fontWeight: 700 }}>−₹{appliedPromo.discount}</span>
                </div>
              )}
              <div style={s.summaryTotal}>
                <span>Total to Pay</span>
                <span>₹{Math.max(0, subtotal + (appliedPromo?.isFreeDel ? 0 : deliveryFee) - discount - (appliedPromo && !appliedPromo.isFreeDel ? appliedPromo.discount : 0)).toFixed(2)}</span>
              </div>
              {(discount > 0 || appliedPromo) && (
                <div style={s.savings}>
                  🎉 You're saving ₹{discount + (appliedPromo && !appliedPromo.isFreeDel ? appliedPromo.discount : 0) + (deliveryFee === 0 || appliedPromo?.isFreeDel ? 40 : 0)} on this order!
                </div>
              )}
            </div>

            {/* Delivery Details & Real Order Now Form */}
            <div style={s.card}>
              <div style={s.sectionTitle}>
                <LocationOn style={{ color: "#e23744" }} />
                Delivery Details
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 10 }}>
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

                <div style={{ padding: "0 20px", width: "100%" }}>
                  <FInput
                    label="Email Address"
                    icon={EmailIcon}
                    type="email"
                    value={delivery.email}
                    onChange={(e) => setDelivery((d) => ({ ...d, email: e.target.value }))}
                    placeholder="rahul@example.com"
                    required
                    inputStyle={{ height: 54, fontSize: 16, width: "100%" }}
                  />
                </div>

                <div style={{ padding: "0 20px" }}>
                  <FInput
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    value={delivery.phone}
                    onChange={(e) => setDelivery((d) => ({ ...d, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    placeholder="9876543210"
                    required
                  />
                </div>

                <div style={{ padding: "0 20px" }}>
                  <FInput
                    label="Delivery Address"
                    icon={LocationOn}
                    value={delivery.address}
                    onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))}
                    placeholder="House/Flat, Street, Area, City"
                    required
                  />
                </div>

                {/* Payment Option Selector */}
                <div style={{ padding: "0 20px", marginTop: 4 }}>
                  <label style={s.label}>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: "1.5px solid #dcdfe3",
                      fontSize: 14,
                      outline: "none",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <option value="COD">💵 Cash on Delivery (COD)</option>
                    <option value="UPI">📱 Pay via UPI (GPay / PhonePe / Paytm)</option>
                    <option value="CARD">💳 Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              {/* REAL ORDER NOW BUTTON */}
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
                  <>
                    <CircularProgress size={20} style={{ color: "#ffffff" }} />
                    Placing Order...
                  </>
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

      {/* ORDER SUCCESS MODAL */}
      <Modal open={orderSuccessModal} onClose={handleCloseSuccessModal}>
        <div style={s.modalContent}>
          <CheckCircle style={{ fontSize: 64, color: "#27ae60", marginBottom: 12 }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1c", margin: "0 0 8px" }}>
            Order Placed!
          </h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
            Thank you for ordering with Foodeli! Your order has been dispatched to the restaurant kitchen.
          </p>
          <div style={{ background: "#f8f9fa", padding: 12, borderRadius: 8, fontSize: 13, color: "#333", marginBottom: 20, textAlign: "left" }}>
            <strong>Order ID:</strong> {createdOrderDetails?._id || "ORD-SUCCESS"}<br />
            <strong>Total Amount:</strong> ₹{total.toFixed(2)}<br />
            <strong>Status:</strong> Preparing in Kitchen 🍳
          </div>
          <button style={s.browseBtn} onClick={handleCloseSuccessModal}>
            View Order Status
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
