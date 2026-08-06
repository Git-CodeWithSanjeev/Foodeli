import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserRoutes from "./routes/User.js";
import FoodRoutes from "./routes/Food.js";
import RestaurantRoutes from "./routes/Restaurant.js";
import Food from "./models/Food.js";
import Restaurant from "./models/Restaurant.js";
import { getRealRestaurantImage, createMenuForRestaurant } from "./services/placeService.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from server/.env (always use this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });


const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    next();
  }
});

app.use("/api/user/", UserRoutes);
app.use("/api/food/", FoodRoutes);
app.use("/api/restaurant/", RestaurantRoutes);

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Foodeli Zomato Delivery API is running!",
  });
});

const seedInitialDataIfNeeded = async () => {
  try {
    const existingCount = await Restaurant.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️ Database already initialized with ${existingCount} restaurants.`);
      return;
    }
    
    console.log("🌱 Seeding 25+ real Zomato restaurants & food data...");
    
    const sampleRestaurants = [
      {
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
        name: "Paradise Biryani House",
        cuisine: ["Biryani", "Hyderabadi", "Mughlai"],
        address: "Leader Road, Allahabad / Prayagraj",
        city: "Allahabad / Prayagraj",
        location: { lat: 25.4450, lng: 81.8400 },
        rating: 4.7,
        numReviews: 2200,
        isPureVeg: false,
        costForTwo: 380,
        discountOffer: "60% OFF up to ₹120",
        isTopBrand: false,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600"
      },
      {
        name: "Pizza Hut",
        cuisine: ["Pizza", "Italian", "Pasta"],
        address: "Katra, Allahabad / Prayagraj",
        city: "Allahabad / Prayagraj",
        location: { lat: 25.4600, lng: 81.8520 },
        rating: 4.3,
        numReviews: 2800,
        isPureVeg: false,
        costForTwo: 500,
        discountOffer: "FLAT ₹125 OFF",
        isTopBrand: true,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600"
      },
      {
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
      },
      {
        name: "Chai Point & Snacks",
        cuisine: ["Tea", "Beverages", "Street Food", "Snacks"],
        address: "Civil Lines, Allahabad / Prayagraj",
        city: "Allahabad / Prayagraj",
        location: { lat: 25.4510, lng: 81.8365 },
        rating: 4.4,
        numReviews: 950,
        isPureVeg: true,
        costForTwo: 180,
        discountOffer: "20% OFF",
        isTopBrand: true,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600"
      },
      {
        name: "Barbeque Nation",
        cuisine: ["North Indian", "BBQ", "Kebabs", "Buffet"],
        address: "MG Marg, Civil Lines, Allahabad / Prayagraj",
        city: "Allahabad / Prayagraj",
        location: { lat: 25.4518, lng: 81.8355 },
        rating: 4.7,
        numReviews: 4100,
        isPureVeg: false,
        costForTwo: 900,
        discountOffer: "FLAT 20% OFF",
        isTopBrand: true,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
      },
      {
        name: "Subhash Chauraha Chaat King",
        cuisine: ["Pure Veg", "Street Food", "Chaats", "Tikki"],
        address: "Subhash Chauraha, Civil Lines, Allahabad / Prayagraj",
        city: "Allahabad / Prayagraj",
        location: { lat: 25.4492, lng: 81.8330 },
        rating: 4.8,
        numReviews: 1600,
        isPureVeg: true,
        costForTwo: 150,
        discountOffer: "50% OFF up to ₹100",
        isTopBrand: false,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
      },
      {
        name: "Royal Cafe & Restaurant",
        cuisine: ["North Indian", "Chinese", "Mughlai", "Desserts"],
        address: "Tashkent Marg, Allahabad / Prayagraj",
        city: "Allahabad / Prayagraj",
        location: { lat: 25.4535, lng: 81.8380 },
        rating: 4.5,
        numReviews: 1750,
        isPureVeg: false,
        costForTwo: 550,
        discountOffer: "FLAT 15% OFF",
        isTopBrand: false,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
      },
      {
        name: "Saravana Bhavan South Indian",
        cuisine: ["Pure Veg", "South Indian", "Thali", "Sweets"],
        address: "Connaught Place, New Delhi",
        city: "Connaught Place, Delhi",
        location: { lat: 28.6315, lng: 77.2167 },
        rating: 4.6,
        numReviews: 5200,
        isPureVeg: true,
        costForTwo: 450,
        discountOffer: "20% OFF",
        isTopBrand: true,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600"
      },
      {
        name: "Kake Da Nappe Dhaba",
        cuisine: ["North Indian", "Punjabi", "Tandoori", "Mughlai"],
        address: "Outer Circle, Connaught Place, New Delhi",
        city: "Connaught Place, Delhi",
        location: { lat: 28.6328, lng: 77.2195 },
        rating: 4.7,
        numReviews: 4800,
        isPureVeg: false,
        costForTwo: 600,
        discountOffer: "FLAT ₹125 OFF",
        isTopBrand: true,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
      },
      {
        name: "Mainland China",
        cuisine: ["Chinese", "Asian", "Dimsum", "Seafood"],
        address: "Bandra West, Mumbai",
        city: "Bandra, Mumbai",
        location: { lat: 19.0596, lng: 72.8295 },
        rating: 4.6,
        numReviews: 3600,
        isPureVeg: false,
        costForTwo: 1200,
        discountOffer: "FLAT 20% OFF",
        isTopBrand: true,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
      }
    ];

    const formattedRestaurants = sampleRestaurants.map((r, idx) => ({
      ...r,
      image: getRealRestaurantImage(r.name, r.cuisine, idx),
    }));

    const createdRestaurants = await Restaurant.insertMany(formattedRestaurants);

    // Seed unique, brand & cuisine specific menus for each restaurant
    for (let i = 0; i < createdRestaurants.length; i++) {
      const rest = createdRestaurants[i];
      const foods = await createMenuForRestaurant(rest._id, rest.isPureVeg, rest.name, rest.cuisine);
      rest.menu = foods.map(f => f._id);
      await rest.save();
    }

    console.log("✅ Seeded 25+ Zomato restaurants & food data successfully!");
  } catch (err) {
    console.error("⚠️ Failed to seed Zomato data:", err.message);
  }
};

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  mongoose.set("strictQuery", true);
  const targets = [];
  
  const envUri = process.env.MONGODB_URL || "mongodb+srv://Foodeli_Admin:Batman1221@foodeli.k4f3jn8.mongodb.net/?retryWrites=true&w=majority&appName=Foodeli";
  targets.push({ name: "Configured MONGODB_URL", uri: envUri });
  targets.push({ name: "Local MongoDB", uri: "mongodb://127.0.0.1:27017/food_delivery" });

  for (const target of targets) {
    try {
      console.log(`Attempting to connect to ${target.name}...`);
      await mongoose.connect(target.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      isConnected = true;
      console.log(`✅ Successfully connected to ${target.name}`);
      await seedInitialDataIfNeeded();
      return;
    } catch (err) {
      console.log(`⚠️ ${target.name} connection failed: ${err.message}`);
    }
  }

  if (!process.env.VERCEL) {
    console.log("🚀 Starting In-Memory MongoDB Server...");
    try {
      const mongoServer = await MongoMemoryServer.create({
        binary: { version: "4.4.18" }
      });
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log(`✅ Successfully connected to In-Memory MongoDB at ${memoryUri}`);
      await seedInitialDataIfNeeded();
    } catch (memErr) {
      console.error("❌ Failed to start In-Memory MongoDB Server:", memErr.message);
    }
  }
};

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
