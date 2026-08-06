import express from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import {
  createRestaurant,
  getAllRestaurants,
  getNearbyRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addToMenu,
  removeFromMenu,
} from "../controllers/Restaurant.js";

const router = express.Router();

// Public routes
router.get("/", getAllRestaurants);
router.get("/nearby", getNearbyRestaurants);
router.get("/:id", getRestaurant);

// Protected routes (require authentication)
router.post("/", verifyToken, createRestaurant);
router.put("/:id", verifyToken, updateRestaurant);
router.delete("/:id", verifyToken, deleteRestaurant);
router.post("/:id/menu", verifyToken, addToMenu);
router.delete("/:id/menu", verifyToken, removeFromMenu);

export default router;
