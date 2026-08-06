import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import { createError } from "../error.js";

import { fetchLivePlacesFromAPI, getRealRestaurantImage } from "../services/placeService.js";

// Helper function to calculate distance between two coordinates in km (Haversine formula)
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

const FALLBACK_RESTAURANTS = [
  {
    _id: "650000000000000000000001",
    name: "El Chico Restaurant",
    cuisine: ["North Indian", "Chinese", "Continental", "Mughlai"],
    address: "Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4520, lng: 81.8340 },
    rating: 4.6,
    numReviews: 2400,
    isPureVeg: false,
    costForTwo: 600,
    discountOffer: "FLAT 20% OFF",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
  },
  {
    _id: "650000000000000000000002",
    name: "Haldiram's Sweets & Restaurant",
    cuisine: ["Pure Veg", "North Indian", "South Indian", "Mithai", "Street Food"],
    address: "MG Marg, Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4505, lng: 81.8360 },
    rating: 4.5,
    numReviews: 3800,
    isPureVeg: true,
    costForTwo: 350,
    discountOffer: "50% OFF up to ₹100",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
  },
  {
    _id: "650000000000000000000003",
    name: "Domino's Pizza",
    cuisine: ["Pizza", "Italian", "Fast Food", "Desserts"],
    address: "Katra Main Road, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4580, lng: 81.8510 },
    rating: 4.4,
    numReviews: 4500,
    isPureVeg: false,
    costForTwo: 400,
    discountOffer: "FLAT ₹125 OFF",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600"
  },
  {
    _id: "650000000000000000000004",
    name: "Eat On Biryani Corner",
    cuisine: ["Biryani", "Mughlai", "Kebabs"],
    address: "Civil Lines, Near Subhash Chauraha, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4490, lng: 81.8320 },
    rating: 4.7,
    numReviews: 1900,
    isPureVeg: false,
    costForTwo: 300,
    discountOffer: "60% OFF up to ₹120",
    isTopBrand: false,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600"
  },
  {
    _id: "650000000000000000000005",
    name: "Bikanervala Pure Veg",
    cuisine: ["Pure Veg", "South Indian", "North Indian", "Chaats", "Sweets"],
    address: "Tashkent Marg, Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4540, lng: 81.8375 },
    rating: 4.5,
    numReviews: 2100,
    isPureVeg: true,
    costForTwo: 300,
    discountOffer: "FLAT 15% OFF",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
  },
  {
    _id: "650000000000000000000006",
    name: "Burger King",
    cuisine: ["Burger", "American", "Fast Food", "Beverages"],
    address: "Valkyrie Mall, Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4512, lng: 81.8335 },
    rating: 4.3,
    numReviews: 3100,
    isPureVeg: false,
    costForTwo: 350,
    discountOffer: "60% OFF up to ₹120",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600"
  },
  {
    _id: "650000000000000000000007",
    name: "Netram Sweets & Thali",
    cuisine: ["Pure Veg", "Thali", "North Indian", "Desi Ghee Sweets"],
    address: "Katra Market, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4610, lng: 81.8540 },
    rating: 4.8,
    numReviews: 2900,
    isPureVeg: true,
    costForTwo: 250,
    discountOffer: "20% OFF",
    isTopBrand: false,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
  },
  {
    _id: "650000000000000000000008",
    name: "KFC Fried Chicken",
    cuisine: ["Burger", "Fast Food", "American", "Beverages"],
    address: "Tashkent Marg, Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4530, lng: 81.8370 },
    rating: 4.4,
    numReviews: 3400,
    isPureVeg: false,
    costForTwo: 450,
    discountOffer: "FLAT 20% OFF",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
  },
  {
    _id: "650000000000000000000009",
    name: "Sagar Ratna South Indian",
    cuisine: ["Pure Veg", "South Indian", "Dosa", "Idli", "Chinese"],
    address: "MG Marg, Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4495, lng: 81.8345 },
    rating: 4.6,
    numReviews: 1800,
    isPureVeg: true,
    costForTwo: 400,
    discountOffer: "50% OFF up to ₹100",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600"
  },
  {
    _id: "650000000000000000000010",
    name: "Subway Sandwiches",
    cuisine: ["Salads", "Healthy Food", "Fast Food"],
    address: "Civil Lines, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4525, lng: 81.8350 },
    rating: 4.2,
    numReviews: 1400,
    isPureVeg: false,
    costForTwo: 350,
    discountOffer: "FLAT 15% OFF",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600"
  },
  {
    _id: "650000000000000000000011",
    name: "Kwality Wall's Ice Cream Parlour",
    cuisine: ["Ice Cream", "Desserts", "Beverages"],
    address: "Chowk, Allahabad / Prayagraj",
    city: "Allahabad / Prayagraj",
    location: { lat: 25.4430, lng: 81.8590 },
    rating: 4.6,
    numReviews: 1200,
    isPureVeg: true,
    costForTwo: 200,
    discountOffer: "FLAT 10% OFF",
    isTopBrand: true,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600"
  }
];

const getFormattedFallbackRestaurants = (userLat, userLng, isPureVeg = false, minRating = null, search = "") => {
  let list = FALLBACK_RESTAURANTS;
  if (isPureVeg) {
    list = list.filter((r) => r.isPureVeg);
  }
  if (minRating) {
    list = list.filter((r) => r.rating >= parseFloat(minRating));
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.cuisine.some((c) => c.toLowerCase().includes(s)) ||
        (r.address && r.address.toLowerCase().includes(s))
    );
  }

  return list.map((rest, index) => {
    const distance = getHaversineDistance(userLat, userLng, rest.location.lat, rest.location.lng);
    const deliveryMins = Math.max(15, Math.min(45, Math.floor(18 + (distance || 1) * 6)));
    const realImg = getRealRestaurantImage(rest.name, rest.cuisine, index);
    return {
      ...rest,
      image: realImg || rest.image,
      distance: distance > 0 ? distance : 1.2,
      deliveryTimeMins: deliveryMins,
      deliveryTime: `${deliveryMins} min`,
      isOpen: true,
      menu: []
    };
  });
};

// Get nearby restaurants based on location, city, and Zomato filters
export const getNearbyRestaurants = async (req, res, next) => {
  const {
    lat,
    lng,
    search,
    cuisine,
    city,
    isPureVeg,
    minRating,
    fastDelivery,
    hasOffers,
    isTopBrand,
    sortBy
  } = req.query;

  const userLat = lat ? parseFloat(lat) : 25.4358;
  const userLng = lng ? parseFloat(lng) : 81.8463;

  const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");

  // Attempt live places fetch safely without throwing 500 on failure
  if (city || search) {
    try {
      await fetchLivePlacesFromAPI(city || "Allahabad", userLat, userLng);
    } catch (placeErr) {
      console.error("fetchLivePlacesFromAPI failed gracefully:", placeErr.message);
    }
  }

  let filter = {};
  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: new RegExp(safeSearch, "i") } },
      { address: { $regex: new RegExp(safeSearch, "i") } },
      { cuisine: { $in: [new RegExp(safeSearch, "i")] } },
    ];
  }
  if (cuisine) {
    filter.cuisine = { $in: [new RegExp(escapeRegex(cuisine), "i")] };
  }
  if (city) {
    const cityPattern = city
      .split(/[\/,]/)
      .map((s) => escapeRegex(s.trim()))
      .filter(Boolean)
      .join("|");
    if (cityPattern) {
      filter.city = { $regex: new RegExp(cityPattern, "i") };
    }
  }
  if (isPureVeg === "true") {
    filter.isPureVeg = true;
  }
  if (minRating) {
    filter.rating = { $gte: parseFloat(minRating) };
  }
  if (hasOffers === "true") {
    filter.discountOffer = { $ne: null, $exists: true };
  }
  if (isTopBrand === "true") {
    filter.isTopBrand = true;
  }

  let restaurants = [];
  try {
    restaurants = await Restaurant.find(filter).populate('menu').exec();
    if (restaurants.length === 0 && filter.city) {
      delete filter.city;
      restaurants = await Restaurant.find(filter).populate('menu').exec();
    }
  } catch (dbErr) {
    console.warn("DB query failed, using fallback restaurant data:", dbErr.message);
  }

  let nearbyList = [];
  if (restaurants && restaurants.length > 0) {
    nearbyList = restaurants.map((rest, index) => {
      const restObj = rest.toObject();
      const restLat = rest.location?.lat || userLat + (Math.random() - 0.5) * 0.04;
      const restLng = rest.location?.lng || userLng + (Math.random() - 0.5) * 0.04;
      
      const distance = getHaversineDistance(userLat, userLng, restLat, restLng);
      const deliveryMins = Math.max(15, Math.min(45, Math.floor(18 + (distance || 1) * 6)));
      const realImg = getRealRestaurantImage(restObj.name, restObj.cuisine, index);

      return {
        ...restObj,
        image: realImg || restObj.image,
        distance: distance > 0 ? distance : 1.2,
        deliveryTimeMins: deliveryMins,
        deliveryTime: `${deliveryMins} min`,
        isOpen: true,
      };
    });
  } else {
    nearbyList = getFormattedFallbackRestaurants(userLat, userLng, isPureVeg === "true", minRating, search);
  }

  if (fastDelivery === "true") {
    nearbyList = nearbyList.filter((rest) => rest.deliveryTimeMins <= 30);
  }

  if (sortBy === "rating_desc") {
    nearbyList.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "delivery_time") {
    nearbyList.sort((a, b) => a.deliveryTimeMins - b.deliveryTimeMins);
  } else if (sortBy === "cost_asc") {
    nearbyList.sort((a, b) => a.costForTwo - b.costForTwo);
  } else if (sortBy === "cost_desc") {
    nearbyList.sort((a, b) => b.costForTwo - a.costForTwo);
  } else {
    nearbyList.sort((a, b) => a.distance - b.distance);
  }

  return res.status(200).json({
    success: true,
    userLocation: { lat: userLat, lng: userLng },
    count: nearbyList.length,
    restaurants: nearbyList,
  });
};

// Create new restaurant
export const createRestaurant = async (req, res, next) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    next(err);
  }
};

// Get all restaurants
export const getAllRestaurants = async (req, res, next) => {
  try {
    let restaurants = [];
    try {
      restaurants = await Restaurant.find().populate('menu').exec();
    } catch (dbErr) {
      console.warn("DB query failed in getAllRestaurants, using fallback data:", dbErr.message);
    }

    if (!restaurants || restaurants.length === 0) {
      const fallbackList = getFormattedFallbackRestaurants(25.4358, 81.8463);
      return res.status(200).json(fallbackList);
    }

    const list = restaurants.map((rest, index) => ({
      ...rest.toObject(),
      image: getRealRestaurantImage(rest.name, rest.cuisine, index) || rest.image,
    }));
    res.status(200).json(list);
  } catch (err) {
    const fallbackList = getFormattedFallbackRestaurants(25.4358, 81.8463);
    res.status(200).json(fallbackList);
  }
};

// Get single restaurant
export const getRestaurant = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const fallback = FALLBACK_RESTAURANTS[0];
      return res.status(200).json(fallback);
    }

    let restaurant = null;
    try {
      restaurant = await Restaurant.findById(req.params.id).populate('menu').exec();
    } catch (dbErr) {
      console.warn("DB error in getRestaurant:", dbErr.message);
    }

    if (!restaurant) {
      const fallback = FALLBACK_RESTAURANTS.find(r => r._id === req.params.id) || FALLBACK_RESTAURANTS[0];
      return res.status(200).json(fallback);
    }

    const realImg = getRealRestaurantImage(restaurant.name, restaurant.cuisine, 0);
    res.status(200).json({
      ...restaurant.toObject(),
      image: realImg || restaurant.image,
    });
  } catch (err) {
    const fallback = FALLBACK_RESTAURANTS[0];
    res.status(200).json(fallback);
  }
};

// Update restaurant
export const updateRestaurant = async (req, res, next) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedRestaurant) {
      return next(createError(404, "Restaurant not found"));
    }
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    next(err);
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(createError(404, "Restaurant not found"));
    }
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Add food item to restaurant menu
export const addToMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(createError(404, "Restaurant not found"));
    }
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $push: { menu: req.body.foodId } },
      { new: true }
    ).populate('menu');
    
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    next(err);
  }
};

// Remove food item from restaurant menu
export const removeFromMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(createError(404, "Restaurant not found"));
    }
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $pull: { menu: req.body.foodId } },
      { new: true }
    ).populate('menu');
    
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    next(err);
  }
};
