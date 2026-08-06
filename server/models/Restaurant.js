import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cuisine: {
      type: [String],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "Allahabad / Prayagraj",
    },
    location: {
      lat: { type: Number, default: 25.4358 },
      lng: { type: Number, default: 81.8463 }
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    numReviews: {
      type: Number,
      default: 120,
    },
    isPureVeg: {
      type: Boolean,
      default: false,
    },
    costForTwo: {
      type: Number,
      default: 300,
    },
    discountOffer: {
      type: String,
      default: "50% OFF up to ₹100",
    },
    isTopBrand: {
      type: Boolean,
      default: false,
    },
    menu: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    }],
    openingHours: {
      type: String,
      default: "10:00 AM - 11:00 PM"
    },
    contactNumber: {
      type: String,
      default: "+91 98765 43210"
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", RestaurantSchema);
