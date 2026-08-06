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

// Get nearby restaurants based on location, city, and Zomato filters
export const getNearbyRestaurants = async (req, res, next) => {
  try {
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

    const userLat = lat ? parseFloat(lat) : 25.4358; // Default Allahabad / Prayagraj lat
    const userLng = lng ? parseFloat(lng) : 81.8463; // Default Allahabad / Prayagraj lng

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
      filter.city = { $regex: new RegExp(escapeRegex(city), "i") };
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

    let restaurants = await Restaurant.find(filter).populate('menu').exec();

    // If city filter returned no results, relax city filter to find nearest coordinates
    if (restaurants.length === 0 && filter.city) {
      delete filter.city;
      restaurants = await Restaurant.find(filter).populate('menu').exec();
    }

    // Map restaurants with distance and delivery time
    let nearbyList = restaurants.map((rest, index) => {
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

    // Apply fast delivery filter (< 30 mins) if requested
    if (fastDelivery === "true") {
      nearbyList = nearbyList.filter((rest) => rest.deliveryTimeMins <= 30);
    }

    // Apply sorting
    if (sortBy === "rating_desc") {
      nearbyList.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "delivery_time") {
      nearbyList.sort((a, b) => a.deliveryTimeMins - b.deliveryTimeMins);
    } else if (sortBy === "cost_asc") {
      nearbyList.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sortBy === "cost_desc") {
      nearbyList.sort((a, b) => b.costForTwo - a.costForTwo);
    } else {
      // Default: sort by distance
      nearbyList.sort((a, b) => a.distance - b.distance);
    }

    return res.status(200).json({
      success: true,
      userLocation: { lat: userLat, lng: userLng },
      count: nearbyList.length,
      restaurants: nearbyList,
    });
  } catch (err) {
    next(err);
  }
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
    const restaurants = await Restaurant.find()
      .populate('menu')
      .exec();
    const list = restaurants.map((rest, index) => ({
      ...rest.toObject(),
      image: getRealRestaurantImage(rest.name, rest.cuisine, index) || rest.image,
    }));
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Get single restaurant
export const getRestaurant = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid restaurant ID"));
    }

    const restaurant = await Restaurant.findById(req.params.id)
      .populate('menu')
      .exec();
    if (!restaurant) {
      return next(createError(404, "Restaurant not found"));
    }
    const realImg = getRealRestaurantImage(restaurant.name, restaurant.cuisine, 0);
    res.status(200).json({
      ...restaurant.toObject(),
      image: realImg || restaurant.image,
    });
  } catch (err) {
    next(err);
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
