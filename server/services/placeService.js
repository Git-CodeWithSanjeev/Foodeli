import Restaurant from "../models/Restaurant.js";
import Food from "../models/Food.js";

// ===========================================================
// REAL RESTAURANT VENUE & DYNAMIC CUISINE-SPECIFIC MENU ENGINE
// Geoapify Places API Integration + OpenStreetMap Fallback
// Generates unique, authentic food menus tailored to every restaurant brand & cuisine
// ===========================================================

// Comprehensive City Coordinate Lookup Table for Indian Cities & Regions
const CITY_COORDS = {
  // Uttar Pradesh & North India
  "allahabad":             { lat: 25.4358, lng: 81.8463 },
  "prayagraj":            { lat: 25.4358, lng: 81.8463 },
  "allahabad / prayagraj": { lat: 25.4358, lng: 81.8463 },
  "lucknow":              { lat: 26.8467, lng: 80.9462 },
  "kanpur":               { lat: 26.4499, lng: 80.3319 },
  "varanasi":             { lat: 25.3176, lng: 82.9739 },
  "agra":                 { lat: 27.1767, lng: 78.0081 },
  "noida":                { lat: 28.5355, lng: 77.3910 },
  "ghaziabad":             { lat: 28.6692, lng: 77.4538 },
  "mathura":              { lat: 27.4924, lng: 77.6737 },
  "dehradun":             { lat: 30.3165, lng: 78.0322 },

  // Delhi NCR
  "delhi":                { lat: 28.6139, lng: 77.2090 },
  "new delhi":            { lat: 28.6139, lng: 77.2090 },
  "gurgaon":              { lat: 28.4595, lng: 77.0266 },
  "gurugram":             { lat: 28.4595, lng: 77.0266 },
  "faridabad":            { lat: 28.4089, lng: 77.3178 },

  // Maharashtra & West India
  "mumbai":               { lat: 19.0760, lng: 72.8777 },
  "thane":                { lat: 19.2183, lng: 72.9781 },
  "navi mumbai":          { lat: 19.0330, lng: 73.0297 },
  "pune":                 { lat: 18.5204, lng: 73.8567 },
  "nagpur":               { lat: 21.1458, lng: 79.0882 },
  "nashik":               { lat: 19.9975, lng: 73.7898 },
  "goa":                  { lat: 15.2993, lng: 74.1240 },
  "panaji":               { lat: 15.4909, lng: 73.8278 },

  // Gujarat
  "ahmedabad":            { lat: 23.0225, lng: 72.5714 },
  "surat":                { lat: 21.1702, lng: 72.8311 },
  "vadodara":             { lat: 22.3072, lng: 73.1812 },

  // Rajasthan
  "jaipur":               { lat: 26.9124, lng: 75.7873 },
  "jodhpur":              { lat: 26.2389, lng: 73.0243 },
  "udaipur":              { lat: 24.5854, lng: 73.7125 },

  // Karnataka & South India
  "bangalore":            { lat: 12.9716, lng: 77.5946 },
  "bengaluru":            { lat: 12.9716, lng: 77.5946 },
  "mysore":               { lat: 12.2958, lng: 76.6394 },

  // Telangana & Andhra Pradesh
  "hyderabad":            { lat: 17.3850, lng: 78.4867 },
  "visakhapatnam":        { lat: 17.6868, lng: 83.2185 },
  "vijayawada":           { lat: 16.5062, lng: 80.6480 },

  // Tamil Nadu & Kerala
  "chennai":              { lat: 13.0827, lng: 80.2707 },
  "coimbatore":           { lat: 11.0168, lng: 76.9558 },
  "madurai":              { lat: 9.9252, lng: 78.1198 },
  "kochi":                { lat: 9.9312, lng: 76.2673 },
  "cochin":               { lat: 9.9312, lng: 76.2673 },
  "trivandrum":           { lat: 8.5241, lng: 76.9366 },
  "thiruvananthapuram":   { lat: 8.5241, lng: 76.9366 },

  // West Bengal & East / Central India
  "kolkata":              { lat: 22.5726, lng: 88.3639 },
  "patna":                { lat: 25.5941, lng: 85.1376 },
  "bhubaneswar":          { lat: 20.2961, lng: 85.8245 },
  "indore":               { lat: 22.7196, lng: 75.8577 },
  "bhopal":               { lat: 23.2599, lng: 77.4126 },
  "chandigarh":           { lat: 30.7333, lng: 76.7794 },
  "amritsar":             { lat: 31.6340, lng: 74.8723 },
};

// Known Indian Restaurant Venue Storefronts / Interiors
const KNOWN_RESTAURANT_VENUES = {
  "baati chokha": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  "jannat": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
  "little green kitchen": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  "tunday kababi": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "royal cafe": "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=800",
  "el chico": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "haldiram": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  "bikanervala": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  "domino": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
  "burger king": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
  "kfc": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
  "subway": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
  "sagar ratna": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "barbeque nation": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  "netram": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
};

// Venue Interior photos by Restaurant Style
const RESTAURANT_VENUE_PHOTOS = {
  fine_dining: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    "https://images.unsplash.com/photo-1551218372-a8789b81b253?w=800",
  ],
  indian_heritage: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  ],
  cafe_bistro: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800",
  ],
  fast_food: [
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
  ],
  rooftop: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  ]
};

// Helper: Real Restaurant Storefront & Dining Venue Resolver
export const getRealRestaurantImage = (name = "", cuisines = [], index = 0) => {
  const nameLower = name.toLowerCase().trim();

  for (const [key, url] of Object.entries(KNOWN_RESTAURANT_VENUES)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }

  const text = (nameLower + " " + cuisines.join(" ")).toLowerCase();

  if (text.includes("cafe") || text.includes("green") || text.includes("bistro") || text.includes("coffee") || text.includes("tea")) {
    return RESTAURANT_VENUE_PHOTOS.cafe_bistro[index % RESTAURANT_VENUE_PHOTOS.cafe_bistro.length];
  }
  if (text.includes("rooftop") || text.includes("terrace") || text.includes("sky") || text.includes("garden") || text.includes("jannat")) {
    return RESTAURANT_VENUE_PHOTOS.rooftop[index % RESTAURANT_VENUE_PHOTOS.rooftop.length];
  }
  if (text.includes("burger") || text.includes("pizza") || text.includes("fast food") || text.includes("kfc") || text.includes("domino")) {
    return RESTAURANT_VENUE_PHOTOS.fast_food[index % RESTAURANT_VENUE_PHOTOS.fast_food.length];
  }
  if (text.includes("biryani") || text.includes("mughlai") || text.includes("kebab") || text.includes("thali") || text.includes("chokha") || text.includes("dhaba")) {
    return RESTAURANT_VENUE_PHOTOS.indian_heritage[index % RESTAURANT_VENUE_PHOTOS.indian_heritage.length];
  }

  return RESTAURANT_VENUE_PHOTOS.fine_dining[index % RESTAURANT_VENUE_PHOTOS.fine_dining.length];
};

// ===============================================================
// DYNAMIC CUISINE & RESTAURANT SPECIFIC DISH DICTIONARIES
// Provides authentic food menus for every cuisine & restaurant type
// ===============================================================
export const CUISINE_SPECIFIC_DISHES = {
  biryani_mughlai: [
    { name: "Lucknowi Chicken Dum Biryani", price: 290, category: ["Biryani", "Mughlai"], desc: "Fragrant basmati rice slow-cooked on dum with tender chicken & mace-cardamom spices", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", isVeg: false },
    { name: "Mutton Galouti Kebab (4 pcs)", price: 340, category: ["Kebabs", "Mughlai"], desc: "Melt-in-mouth minced mutton kebabs infused with 160 secret spices", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500", isVeg: false },
    { name: "Chicken Tikka Butter Masala", price: 310, category: ["North Indian", "Mughlai"], desc: "Smoky tandoori chicken tikka cooked in rich makhani gravy", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500", isVeg: false },
    { name: "Shahi Paneer Korma", price: 260, category: ["Paneer", "North Indian"], desc: "Fresh cottage cheese in creamy cashew & melon seed gravy", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500", isVeg: true },
    { name: "Butter Rumali Roti (2 pcs)", price: 50, category: ["Breads"], desc: "Paper-thin soft flatbread tossed on a reverse tawa", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500", isVeg: true },
    { name: "Lucknowi Kesari Phirni", price: 90, category: ["Desserts"], desc: "Ground rice pudding set in clay earthenware pots flavored with saffron", img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500", isVeg: true }
  ],
  pureveg_thali: [
    { name: "Special Desi Ghee Thali", price: 240, category: ["Thali", "Pure Veg"], desc: "Complete meal with 2 sabzi, dal fry, basmati rice, butter roti, papad & dessert", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500", isVeg: true },
    { name: "Paneer Butter Masala", price: 230, category: ["Paneer", "North Indian"], desc: "Cottage cheese cubes simmered in butter rich tomato gravy", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500", isVeg: true },
    { name: "Dal Makhani Desi Ghee", price: 190, category: ["Dal", "North Indian"], desc: "Overnight slow cooked black lentils with white butter & fresh cream", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500", isVeg: true },
    { name: "Amritsari Chole Bhature (2 pcs)", price: 160, category: ["North Indian", "Street Food"], desc: "Spiced tangy chickpeas served with fluffy golden bhature & pickle", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500", isVeg: true },
    { name: "Kesar Rasmalai (2 pcs)", price: 110, category: ["Desserts", "Sweets"], desc: "Soft flattened chenna discs soaked in saffron cardamom milk", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", isVeg: true },
    { name: "Litti Chokha Special", price: 180, category: ["Thali", "Pure Veg"], desc: "Desi ghee dipped sattu litti served with roasted brinjal-potato chokha", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500", isVeg: true }
  ],
  pizza_italian: [
    { name: "Farmhouse Cheese Burst Pizza", price: 349, category: ["Pizza", "Italian"], desc: "Crisp capsicum, onion, fresh tomato & mushroom with liquid cheese burst crust", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500", isVeg: true },
    { name: "Classic Margherita Pizza", price: 249, category: ["Pizza", "Italian"], desc: "Fresh basil leaves, 100% mozzarella cheese & herb tomato sauce", img: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500", isVeg: true },
    { name: "Stuffed Garlic Breadsticks", price: 149, category: ["Starters", "Italian"], desc: "Freshly baked garlic bread filled with mozzarella & jalapenos", img: "https://images.unsplash.com/photo-1573140247614-6cb4812a6f23?w=500", isVeg: true },
    { name: "Creamy Alfredo Penne Pasta", price: 229, category: ["Pasta", "Italian"], desc: "Penne tossed in rich white cream sauce with exotic vegetables", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=500", isVeg: true },
    { name: "Molten Choco Lava Cake", price: 109, category: ["Desserts"], desc: "Warm chocolate cake with oozing melted chocolate center", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", isVeg: true }
  ],
  burger_fastfood: [
    { name: "Crispy Veg Whopper Burger", price: 179, category: ["Burger", "Fast Food"], desc: "Flame-grilled crispy veg patty loaded with mayo, onion & crisp lettuce", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", isVeg: true },
    { name: "Fiery Chicken Zinger Burger", price: 219, category: ["Burger", "Fast Food"], desc: "Extra crispy spiced chicken fillet burger with spicy sriracha sauce", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", isVeg: false },
    { name: "Peri Peri Fries (Large)", price: 119, category: ["Sides", "Fast Food"], desc: "Golden fried potato sticks tossed in African peri peri seasoning", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", isVeg: true },
    { name: "Smokey BBQ Chicken Wings (6 pcs)", price: 249, category: ["Starters"], desc: "Juicy chicken wings coated in sweet & smokey barbecue glaze", img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500", isVeg: false },
    { name: "Belgian Chocolate Thickshake", price: 139, category: ["Beverages"], desc: "Rich blend of dark Belgian chocolate ice cream & chilled milk", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500", isVeg: true }
  ],
  south_indian: [
    { name: "Mysore Special Masala Dosa", price: 150, category: ["Dosa", "South Indian"], desc: "Crispy rice crepe smeared with red chili-garlic chutney & potato masala", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500", isVeg: true },
    { name: "Desi Ghee Paper Dosa", price: 160, category: ["Dosa", "South Indian"], desc: "Extra long paper thin crispy dosa roasted in pure clarified butter", img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500", isVeg: true },
    { name: "Steamed Button Idli Sambar (2 pcs)", price: 90, category: ["South Indian"], desc: "Soft fluffy rice cakes served with hot lentil sambar & coconut chutney", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500", isVeg: true },
    { name: "Crispy Medu Vada (2 pcs)", price: 110, category: ["South Indian"], desc: "Golden fried lentil donuts served with sambar & mint chutney", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500", isVeg: true },
    { name: "Kumbakonam Filter Coffee", price: 60, category: ["Beverages"], desc: "Authentic South Indian chicory decoction coffee served hot in brass dabarah", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500", isVeg: true }
  ],
  chinese_asian: [
    { name: "Veg Hakka Noodles", price: 160, category: ["Noodles", "Chinese"], desc: "Wok tossed noodles with shredded cabbage, bell peppers & soy sauce", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500", isVeg: true },
    { name: "Steamed Veg Momos (8 pcs)", price: 130, category: ["Momos", "Chinese"], desc: "Himalayan dumplings filled with finely chopped vegetables & garlic dip", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500", isVeg: true },
    { name: "Chilli Paneer Dry", price: 220, category: ["Chinese", "Paneer"], desc: "Fried cottage cheese cubes tossed with capsicum, onion & chili garlic sauce", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500", isVeg: true },
    { name: "Veg Manchurian Gravy with Fried Rice", price: 210, category: ["Chinese", "Combos"], desc: "Vegetable dumplings in savory dark soy gravy served with vegetable fried rice", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500", isVeg: true },
    { name: "Crispy Honey Chilli Potato", price: 170, category: ["Starters", "Chinese"], desc: "Crispy fried potato fingers tossed in sesame sweet honey chili sauce", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500", isVeg: true }
  ],
  sweets_desserts: [
    { name: "Belgian Chocolate Sundae", price: 170, category: ["Desserts"], desc: "Dark chocolate ice cream scoop with hot fudge sauce & choco chips", img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500", isVeg: true },
    { name: "Pure Desi Ghee Kaju Katli (250g)", price: 260, category: ["Sweets"], desc: "Premium cashew fudge topped with edible silver leaf", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", isVeg: true },
    { name: "Hot Chocolate Brownie", price: 150, category: ["Desserts"], desc: "Fudgy chocolate brownie served with vanilla ice cream scoop", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", isVeg: true },
    { name: "Bengali Sponge Rasgulla (4 pcs)", price: 100, category: ["Sweets"], desc: "Soft spongy chenna balls soaked in light cardamon sugar syrup", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", isVeg: true }
  ]
};

// Resolver for menu templates by restaurant name & cuisine
export const getMenuTemplatesForRestaurant = (name = "", cuisines = [], isPureVeg = false) => {
  const text = (name + " " + cuisines.join(" ")).toLowerCase();

  let dishList = [];

  if (text.includes("pizza") || text.includes("domino") || text.includes("italian")) {
    dishList = CUISINE_SPECIFIC_DISHES.pizza_italian;
  } else if (text.includes("burger") || text.includes("kfc") || text.includes("fast food")) {
    dishList = CUISINE_SPECIFIC_DISHES.burger_fastfood;
  } else if (text.includes("dosa") || text.includes("south indian") || text.includes("sagar ratna")) {
    dishList = CUISINE_SPECIFIC_DISHES.south_indian;
  } else if (text.includes("chinese") || text.includes("noodles") || text.includes("momo")) {
    dishList = CUISINE_SPECIFIC_DISHES.chinese_asian;
  } else if (text.includes("sweets") || text.includes("ice cream") || text.includes("kwality")) {
    dishList = CUISINE_SPECIFIC_DISHES.sweets_desserts;
  } else if (text.includes("biryani") || text.includes("kebab") || text.includes("mughlai") || text.includes("tunday")) {
    dishList = CUISINE_SPECIFIC_DISHES.biryani_mughlai;
  } else {
    dishList = CUISINE_SPECIFIC_DISHES.pureveg_thali;
  }

  if (isPureVeg) {
    return dishList.filter((d) => d.isVeg);
  }
  return dishList;
};

const DISCOUNT_OFFERS = [
  "50% OFF up to ₹100",
  "FLAT 20% OFF",
  "FLAT ₹125 OFF",
  "60% OFF up to ₹120",
  "FLAT 15% OFF",
  "40% OFF up to ₹80",
  "Buy 1 Get 1 Free",
  "Free Delivery on ₹299+",
];

const CUISINE_SETS = [
  ["North Indian", "Chinese", "Mughlai"],
  ["Pure Veg", "South Indian", "Mithai"],
  ["Pizza", "Italian", "Fast Food"],
  ["Biryani", "Kebabs", "Mughlai"],
  ["Burger", "American", "Beverages"],
  ["Thali", "Pure Veg", "North Indian"],
  ["Chinese", "Thai", "Asian"],
  ["Chaat", "Street Food", "Snacks"],
];

// ---------------------------------------------------------------
// Attempt to fetch REAL restaurants using Geoapify Places API
// Falls back gracefully to OpenStreetMap if no API key set
// ---------------------------------------------------------------
const fetchFromGeoapify = async (lat, lng, cityName) => {
  const apiKey = process.env.GEOAPIFY_API_KEY || "";
  if (!apiKey || apiKey === "your_geoapify_api_key_here") {
    console.log("ℹ️  No Geoapify API key — using OpenStreetMap fallback");
    return fetchFromOpenStreetMap(cityName, lat, lng);
  }

  try {
    const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food,catering.cafe&filter=circle:${lng},${lat},5000&limit=20&apiKey=${apiKey}`;
    console.log(`🌐 Geoapify API: Fetching real restaurants near ${cityName}...`);
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`Geoapify HTTP ${res.status}`);
    const data = await res.json();

    if (!data?.features?.length) {
      console.log("ℹ️  Geoapify returned 0 results — trying OpenStreetMap...");
      return fetchFromOpenStreetMap(cityName, lat, lng);
    }

    console.log(`✅ Geoapify returned ${data.features.length} real places near ${cityName}`);
    return data.features
      .filter(f => f.properties?.name)
      .map((f) => ({
        name: f.properties.name,
        address: [
          f.properties.address_line1,
          f.properties.address_line2,
          f.properties.city,
        ]
          .filter(Boolean)
          .join(", "),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        categories: f.properties.categories || [],
      }));
  } catch (err) {
    console.log(`⚠️  Geoapify failed: ${err.message} — trying OpenStreetMap...`);
    return fetchFromOpenStreetMap(cityName, lat, lng);
  }
};

// Free fallback: OpenStreetMap Nominatim (no API key needed)
const fetchFromOpenStreetMap = async (cityName, lat, lng) => {
  try {
    const searchCity = cityName.split("/")[0].trim();
    const url = `https://nominatim.openstreetmap.org/search?q=restaurant+${encodeURIComponent(searchCity)}&format=json&limit=20&addressdetails=1`;
    console.log(`🗺️  OSM Nominatim: Fetching real restaurants in ${searchCity}...`);
    const res = await fetch(url, {
      headers: { "User-Agent": "Foodeli-App/2.0 (foodeli@example.com)" },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    return data
      .filter((p) => p.display_name && p.lat && p.lon)
      .map((p) => ({
        name: p.display_name.split(",")[0].trim(),
        address: p.display_name.split(",").slice(1, 4).join(", ").trim(),
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lon),
        categories: [],
      }));
  } catch (err) {
    console.log(`⚠️  OSM failed: ${err.message}`);
    return [];
  }
};

// Create a food menu tailored specifically to the restaurant's name & cuisine
export const createMenuForRestaurant = async (restaurantId, isPureVeg = false, name = "", cuisines = []) => {
  const templates = getMenuTemplatesForRestaurant(name, cuisines, isPureVeg);

  const foodItems = templates.map((tmpl) => ({
    name: tmpl.name,
    desc: tmpl.desc,
    img: tmpl.img,
    price: { org: tmpl.price, mrp: tmpl.price + 50, off: 15 },
    category: tmpl.category,
    restaurant: restaurantId,
    popularity: Math.floor(80 + Math.random() * 20),
    rating: Math.round((4.0 + Math.random() * 0.9) * 10) / 10,
    numReviews: Math.floor(50 + Math.random() * 300),
  }));

  return await Food.insertMany(foodItems);
};

// ---------------------------------------------------------------
// Main export: fetchLivePlacesFromAPI
// Called by the NearbyRestaurants controller
// ---------------------------------------------------------------
export const fetchLivePlacesFromAPI = async (
  cityName = "Allahabad",
  userLat = 25.4358,
  userLng = 81.8463
) => {
  try {
    const key = cityName.toLowerCase().trim();
    const coords = CITY_COORDS[key] || { lat: userLat, lng: userLng };

    const rawPlaces = await fetchFromGeoapify(coords.lat, coords.lng, cityName);

    if (!rawPlaces.length) {
      console.log("ℹ️  No new live places fetched — using seeded data");
      return [];
    }

    const savedRestaurants = [];

    for (let i = 0; i < rawPlaces.length; i++) {
      const place = rawPlaces[i];
      if (!place.name || place.name.length < 3) continue;

      // Skip if restaurant already exists in DB
      const existing = await Restaurant.findOne({
        name: new RegExp(`^${place.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
      });
      if (existing) {
        existing.image = getRealRestaurantImage(existing.name, existing.cuisine, i);
        await existing.save();
        savedRestaurants.push(existing);
        continue;
      }

      const isPureVeg =
        place.name.toLowerCase().includes("veg") ||
        place.name.toLowerCase().includes("sweets") ||
        place.categories?.includes("catering.cafe") ||
        i % 4 === 0;

      const cuisines = CUISINE_SETS[i % CUISINE_SETS.length];
      const realVenueImage = getRealRestaurantImage(place.name, cuisines, i);

      const newRest = new Restaurant({
        name: place.name,
        cuisine: cuisines,
        address:
          place.address || `${cityName.split("/")[0].trim()}, India`,
        city: cityName,
        location: {
          lat: place.lat || coords.lat + (Math.random() - 0.5) * 0.05,
          lng: place.lng || coords.lng + (Math.random() - 0.5) * 0.05,
        },
        rating: Math.round((4.0 + Math.random() * 0.9) * 10) / 10,
        numReviews: Math.floor(100 + Math.random() * 2000),
        isPureVeg,
        costForTwo: Math.floor(150 + Math.random() * 450),
        discountOffer: DISCOUNT_OFFERS[i % DISCOUNT_OFFERS.length],
        isTopBrand: i % 5 === 0,
        openingHours: "10:00 AM – 11:00 PM",
        contactNumber: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
        image: realVenueImage,
      });

      const savedRest = await newRest.save();
      const foods = await createMenuForRestaurant(savedRest._id, isPureVeg, savedRest.name, cuisines);
      savedRest.menu = foods.map((f) => f._id);
      await savedRest.save();
      savedRestaurants.push(savedRest);
    }

    console.log(
      `✅ Live places: ${savedRestaurants.length} restaurants processed for "${cityName}" with brand-specific menus & HD venue imagery`
    );
    return savedRestaurants;
  } catch (err) {
    console.log(`⚠️  fetchLivePlacesFromAPI error: ${err.message}`);
    return [];
  }
};
