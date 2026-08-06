import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getNearbyRestaurants } from "../api";
import RestaurantCard from "../components/cards/RestaurantCard";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { MyLocation, Search, FilterList, Restaurant, Navigation } from "@mui/icons-material";

const Container = styled.div`
  padding: 30px;
  padding-bottom: 120px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  background: ${({ theme }) => theme.bg || "#fafafa"};

  @media (max-width: 768px) {
    padding: 20px 14px;
  }
`;

const HeaderSection = styled.div`
  width: 100%;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  margin: 0;
`;

const LocationBar = styled.div`
  width: 100%;
  max-width: 1300px;
  background: ${({ theme }) => theme.card || "#ffffff"};
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetectButton = styled.button`
  background: ${({ theme }) => theme.primary || "#eb0029"};
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const LocationBadge = styled.div`
  background: #eff6ff;
  color: #1d4ed8;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.bgLight || "#f3f4f6"};
  padding: 8px 16px;
  border-radius: 12px;
  gap: 8px;
  min-width: 280px;
  flex: 1;
  max-width: 400px;

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
  }
`;

const FilterWrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.button`
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid ${({ active, theme }) => (active ? theme.primary || "#eb0029" : "#e5e7eb")};
  background: ${({ active, theme }) => (active ? theme.primary || "#eb0029" : theme.card || "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#4b5563")};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary || "#eb0029"};
  }
`;

const CardGrid = styled.div`
  width: 100%;
  max-width: 1300px;
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
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const CUISINES = ["All", "Indian", "Italian", "Burger", "Biryani", "Chinese", "Dessert"];

const Restaurants = () => {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [userCoords, setUserCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [locationName, setLocationName] = useState("Default (Connaught Place)");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchRestaurants = async (lat, lng, search, cuisine) => {
    setLoading(true);
    try {
      const params = {};
      if (lat) params.lat = lat;
      if (lng) params.lng = lng;
      if (search) params.search = search;
      if (cuisine && cuisine !== "All") params.cuisine = cuisine;

      const response = await getNearbyRestaurants(params);
      if (response.data?.restaurants) {
        setRestaurants(response.data.restaurants);
      }
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setLocationName(`Coordinates: ${lat.toFixed(3)}°, ${lng.toFixed(3)}°`);
          setSnackbarMessage("Location detected successfully!");
          fetchRestaurants(lat, lng, searchQuery, selectedCuisine);
        },
        (error) => {
          console.warn("Geolocation permission denied or error:", error.message);
          setSnackbarMessage("Could not access live GPS location. Using default location.");
          setLoading(false);
        },
        { timeout: 8000 }
      );
    } else {
      setSnackbarMessage("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchRestaurants(userCoords.lat, userCoords.lng, searchQuery, selectedCuisine);
  }, [selectedCuisine]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchRestaurants(userCoords.lat, userCoords.lng, query, selectedCuisine);
  };

  return (
    <Container>
      <HeaderSection>
        <Title>
          <Restaurant style={{ fontSize: "36px", color: "#eb0029" }} />
          Nearby Restaurants
        </Title>
        <Subtitle>Discover popular restaurants near you and order fresh food directly</Subtitle>
      </HeaderSection>

      <LocationBar>
        <LocationInfo>
          <DetectButton onClick={handleDetectLocation}>
            <MyLocation style={{ fontSize: "18px" }} />
            Detect My Location
          </DetectButton>
          <LocationBadge>
            <Navigation style={{ fontSize: "16px" }} />
            {locationName}
          </LocationBadge>
        </LocationInfo>

        <SearchBox>
          <Search style={{ color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="Search restaurant or cuisine..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchBox>
      </LocationBar>

      <FilterWrapper>
        {CUISINES.map((item) => (
          <FilterChip
            key={item}
            active={selectedCuisine === item}
            onClick={() => setSelectedCuisine(item)}
          >
            {item}
          </FilterChip>
        ))}
      </FilterWrapper>

      {loading ? (
        <CircularProgress style={{ marginTop: "40px", color: "#eb0029" }} />
      ) : restaurants.length > 0 ? (
        <CardGrid>
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </CardGrid>
      ) : (
        <NoResults>
          <FilterList style={{ fontSize: "48px" }} />
          <div>No restaurants found matching your criteria. Try detecting location or changing filters.</div>
        </NoResults>
      )}

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" onClose={() => setSnackbarMessage("")}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Restaurants;
