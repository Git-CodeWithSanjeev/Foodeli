import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

const JWT_SECRET = process.env.JWT || "foodeli_secret_jwt_key_2026";

// ── Auth ─────────────────────────────────────────────────────
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    if (!email || !password || !name) {
      return next(createError(400, "Name, email and password are required."));
    }
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) return next(createError(409, "Email is already in use."));

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({ name, email, password: hashedPassword, img });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, JWT_SECRET, { expiresIn: "9999y" });
    return res.status(201).json({ token, user: { _id: createdUser._id, name, email, img } });
  } catch (err) {
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(createError(400, "Email and password are required."));

    const user = await User.findOne({ email }).exec();
    if (!user) return next(createError(404, "No account found with this email."));

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return next(createError(403, "Incorrect password."));

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "9999y" });
    return res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email, img: user.img } });
  } catch (err) {
    next(err);
  }
};

// ── Cart helpers ──────────────────────────────────────────────
const toIdStr = (val) => {
  if (!val) return "";
  return val._id ? val._id.toString() : val.toString();
};

// ── Cart ──────────────────────────────────────────────────────
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return next(createError(400, "productId is required."));
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found."));

    const qty = Math.max(1, parseInt(quantity) || 1);
    const idx = user.cart.findIndex((item) => toIdStr(item.product) === productId.toString());

    if (idx !== -1) {
      user.cart[idx].quantity += qty;
    } else {
      user.cart.push({ product: productId, quantity: qty });
    }
    await user.save();
    return res.status(200).json({ message: "Added to cart.", cartCount: user.cart.length });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return next(createError(400, "productId is required."));
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found."));

    const idx = user.cart.findIndex((item) => toIdStr(item.product) === productId.toString());
    if (idx === -1) return next(createError(404, "Item not found in cart."));

    const qty = quantity ? parseInt(quantity) : null;
    if (qty && qty > 0) {
      user.cart[idx].quantity -= qty;
      if (user.cart[idx].quantity <= 0) user.cart.splice(idx, 1);
    } else {
      user.cart.splice(idx, 1);
    }
    await user.save();
    return res.status(200).json({ message: "Cart updated.", cartCount: user.cart.length });
  } catch (err) {
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({ path: "cart.product", model: "Food" });
    if (!user) return res.status(200).json([]);
    const items = user.cart.filter((item) => item.product != null);
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

// ── Orders ────────────────────────────────────────────────────
export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found."));

    const formattedProducts = Array.isArray(products)
      ? products.map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity || 1,
        }))
      : [];

    const order = new Orders({
      products: formattedProducts,
      user: user._id,
      total_amount: parseFloat(totalAmount) || 0,
      address: address || "No address provided",
    });
    await order.save();
    user.cart = [];
    await user.save();
    return res.status(200).json({ message: "Order placed successfully.", order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find({ user: req.user.id })
      .populate("products.product")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// ── Favourites ────────────────────────────────────────────────
export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return next(createError(400, "productId is required."));
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found."));

    const alreadyAdded = user.favourites.some((id) => id.toString() === productId.toString());
    if (!alreadyAdded) {
      user.favourites.push(productId);
      await user.save();
    }
    return res.status(200).json({ message: "Added to favourites." });
  } catch (err) {
    next(err);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return next(createError(400, "productId is required."));
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found."));

    user.favourites = user.favourites.filter((id) => id.toString() !== productId.toString());
    await user.save();
    return res.status(200).json({ message: "Removed from favourites." });
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites");
    if (!user) return next(createError(404, "User not found."));
    return res.status(200).json(user.favourites);
  } catch (err) {
    next(err);
  }
};
