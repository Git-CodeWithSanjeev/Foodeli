import mongoose from "mongoose";
import Food from "../models/Food.js";
import { createError } from "../error.js";

export const addProducts = async (req, res, next) => {
  try {
    const foodData = req.body;
    if (!Array.isArray(foodData)) {
      return next(
        createError(400, "Invalid request. Expected an array of foods.")
      );
    }
    let createdfoods = [];
    for (const foodInfo of foodData) {
      const { name, desc, img, price, ingredients, category } = foodInfo;
      const product = new Food({
        name,
        desc,
        img,
        price,
        ingredients,
        category,
      });
      const createdFoods = await product.save();
      createdfoods.push(createdFoods);
    }
    return res
      .status(201)
      .json({ message: "Products added successfully", createdfoods });
  } catch (err) {
    next(err);
  }
};

export const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, ingredients, search, popular } = req.query;
    ingredients = ingredients ? ingredients.split(",").filter(Boolean) : null;
    categories = categories ? categories.split(",").filter(Boolean) : null;

    const filter = {};
    if (categories && Array.isArray(categories) && categories.length > 0) {
      filter.category = { $in: categories };
    }
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      filter.ingredients = { $in: ingredients };
    }
    if (maxPrice || minPrice) {
      filter["price.org"] = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);
      }
    }
    if (search) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: new RegExp(safeSearch, "i") } },
        { desc: { $regex: new RegExp(safeSearch, "i") } },
      ];
    }

    let query = Food.find(filter).populate('restaurant', 'name cuisine');
    
    // If popular flag is true, sort by popularity, rating, and numReviews
    if (popular === 'true') {
      query = query.sort({ 
        popularity: -1,
        rating: -1,
        numReviews: -1
      }).limit(8);
    }

    const foodList = await query.exec();

    if (!foodList || foodList.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const food = await Food.findById(id).populate('restaurant', 'name cuisine location rating').exec();
    if (!food) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json(food);
  } catch (err) {
    next(err);
  }
};
