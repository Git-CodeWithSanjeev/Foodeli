import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ZomatoHeader from "../components/ZomatoHeader";
import ZomatoFilterBar from "../components/ZomatoFilterBar";
import ZomatoRestaurantCard from "../components/cards/ZomatoRestaurantCard";
import { getNearbyRestaurants } from "../api";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.main`
  max-width: 1300px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 20px 14px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #1c1c1c;
  margin: 0 0 18px 0;
  letter-spacing: -0.3px;
`;

// Inspiration Carousel
const InspirationGrid = styled.div`
  display: flex;
  gap: 28px;
  overflow-x: auto;
  padding-bottom: 8px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CircleFoodItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover img {
    transform: scale(1.06);
  }
`;

const CircleImg = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;

  ${CircleFoodItem}:hover & {
    transform: translateY(-6px) scale(1.08);
    box-shadow: 0 12px 24px rgba(226, 55, 68, 0.2);
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;

const CircleLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #363636;
`;

// Top Brands Section
const BrandGrid = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BrandCard = styled.div`
  min-width: 200px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    border-color: #e23744;
  }
`;

const BrandImg = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
`;

const BrandName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1c;
  text-align: center;
`;

const BrandTime = styled.span`
  font-size: 12px;
  color: #696969;
  font-weight: 500;
`;

// Restaurant Grid
const RestaurantGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const NoResults = styled.div`
  width: 100%;
  padding: 60px 20px;
  text-align: center;
  color: #696969;
  font-size: 16px;
`;

const INSPIRATION_ITEMS = [
  { name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300" },
  { name: "Pizza", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300" },
  { name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300" },
  { name: "Thali", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300" },
  { name: "Paneer", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300" },
  { name: "Dosa", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300" },
  { name: "Cake", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300" },
];

const TOP_BRANDS = [
  { name: "Domino's Pizza", time: "22 min", img: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=300" },
  { name: "Haldiram's", time: "25 min", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300" },
  { name: "Burger King", time: "20 min", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300" },
  { name: "Bikanervala", time: "28 min", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" },
  { name: "Kwality Wall's", time: "18 min", img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300" },
];

const ZomatoDelivery = ({ setOpenAuth }) => {
  const [selectedCity, setSelectedCity] = useState("Allahabad / Prayagraj");
  const [activeTab, setActiveTab] = useState("delivery");
  const [filters, setFilters] = useState({
    minRating: false,
    isPureVeg: false,
    fastDelivery: false,
    hasOffers: false,
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {
        city: selectedCity,
        sortBy,
      };
      if (filters.minRating) params.minRating = 4.0;
      if (filters.isPureVeg) params.isPureVeg = "true";
      if (filters.fastDelivery) params.fastDelivery = "true";
      if (filters.hasOffers) params.hasOffers = "true";

      const res = await getNearbyRestaurants(params);
      setRestaurants(res.data?.restaurants || []);
    } catch (err) {
      console.error("Error fetching delivery restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCity, filters, sortBy]);

  const handleInspirationClick = (name) => {
    navigate(`/dishes?search=${encodeURIComponent(name)}`);
  };

  return (
    <PageContainer>
      <ZomatoHeader
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setOpenAuth={setOpenAuth}
      />

      <ZomatoFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <ContentContainer>
        {/* Inspiration for your first order */}
        <section>
          <SectionTitle>Inspiration for your first order</SectionTitle>
          <InspirationGrid>
            {INSPIRATION_ITEMS.map((item) => (
              <CircleFoodItem
                key={item.name}
                onClick={() => handleInspirationClick(item.name)}
              >
                <CircleImg
                  src={item.img}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300";
                  }}
                />
                <CircleLabel>{item.name}</CircleLabel>
              </CircleFoodItem>
            ))}
          </InspirationGrid>
        </section>

        {/* Top Brands in focus */}
        <section>
          <SectionTitle>Top brands in focus</SectionTitle>
          <BrandGrid>
            {TOP_BRANDS.map((brand) => (
              <BrandCard
                key={brand.name}
                onClick={() => handleInspirationClick(brand.name)}
              >
                <BrandImg
                  src={brand.img}
                  alt={brand.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300";
                  }}
                />
                <BrandName>{brand.name}</BrandName>
                <BrandTime>{brand.time}</BrandTime>
              </BrandCard>
            ))}
          </BrandGrid>
        </section>

        {/* Delivery Restaurants in City */}
        <section>
          <SectionTitle>
            {restaurants.length > 0 ? `${restaurants.length} Delivery Restaurants in ${selectedCity.split("/")[0].trim()}` : `Delivery Restaurants in ${selectedCity.split("/")[0].trim()}`}
          </SectionTitle>

          {loading ? (
            <CircularProgress style={{ display: "block", margin: "40px auto", color: "#e23744" }} />
          ) : restaurants.length > 0 ? (
            <RestaurantGrid>
              {restaurants.map((restaurant) => (
                <ZomatoRestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </RestaurantGrid>
          ) : (
            <NoResults>
              No restaurants matching your active filters. Try unchecking 4.0+ rating or Pure Veg.
            </NoResults>
          )}
        </section>
      </ContentContainer>

      <Footer />
    </PageContainer>
  );
};

export default ZomatoDelivery;
