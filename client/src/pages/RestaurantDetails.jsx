import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantDetails, addToCart } from "../api";
import { CircularProgress } from "@mui/material";
import {
  Star,
  AccessTime,
  LocationOn,
  Phone,
  LocalOffer,
  Search,
  ShoppingCartOutlined,
  ArrowBack
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import ZomatoHeader from "../components/ZomatoHeader";
import Footer from "../components/Footer";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const BackBtn = styled.button`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c1c;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e23744;
    color: #e23744;
  }
`;

// Restaurant Overview Header
const OverviewCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ImageGallery = styled.div`
  width: 100%;
  height: 320px;
  position: relative;
  overflow: hidden;
  background: #1c1c1c;

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
`;

const InfoBox = styled.div`
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const RestName = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1c1c1c;
  margin: 0;
  letter-spacing: -0.5px;
`;

const RatingBox = styled.div`
  background: #24963f;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 800;
`;

const CuisinesList = styled.div`
  font-size: 15px;
  color: #696969;
  font-weight: 500;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: #363636;
  font-weight: 500;
  padding-top: 12px;
  border-top: 1px solid #f4f4f4;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const OfferBanner = styled.div`
  background: #fff5f5;
  border: 1px dashed #e23744;
  border-radius: 8px;
  padding: 10px 16px;
  color: #e23744;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
`;

// Menu & Dishes Section
const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e8e8e8;
  padding-bottom: 12px;
  gap: 16px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: #1c1c1c;
  margin: 0;
`;

const MenuSearch = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px 14px;
  gap: 8px;
  width: 280px;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CatTab = styled.button`
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? "#e23744" : "#e8e8e8")};
  background: ${({ active }) => (active ? "#e23744" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#696969")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: #e23744;
  }
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DishCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;

const DishInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const VegBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ veg }) => (veg ? "#10b981" : "#ef4444")};
  background: ${({ veg }) => (veg ? "#ecfdf5" : "#fef2f2")};
  border: 1px solid ${({ veg }) => (veg ? "#10b981" : "#ef4444")};
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
`;

const DishName = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
`;

const DishPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1c1c1c;
`;

const DishDesc = styled.p`
  font-size: 13px;
  color: #696969;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const DishImgContainer = styled.div`
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DishImg = styled.img`
  width: 110px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
`;

const AddBtn = styled.button`
  background: #ffffff;
  color: #e23744;
  border: 1px solid #e23744;
  border-radius: 8px;
  padding: 6px 20px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(226, 55, 68, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background: #e23744;
    color: #ffffff;
  }
`;

const RestaurantDetails = ({ setOpenAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartLoading, setCartLoading] = useState({});
  const [selectedCity, setSelectedCity] = useState("Allahabad / Prayagraj");

  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const res = await getRestaurantDetails(id);
      setRestaurant(res.data);
    } catch (err) {
      console.error("Error fetching restaurant details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRestaurant();
  }, [id]);

  const handleAddToCart = async (dishId) => {
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (!token) {
      setOpenAuth(true);
      return;
    }

    try {
      setCartLoading((prev) => ({ ...prev, [dishId]: true }));
      await addToCart({ productId: dishId, quantity: 1 });
      dispatch(
        openSnackbar({
          message: "Item added to cart",
          severity: "success",
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || err.message,
          severity: "error",
        })
      );
    } finally {
      setCartLoading((prev) => ({ ...prev, [dishId]: false }));
    }
  };

  if (loading) {
    return (
      <Container>
        <ZomatoHeader selectedCity={selectedCity} setSelectedCity={setSelectedCity} setOpenAuth={setOpenAuth} />
        <CircularProgress style={{ display: "block", margin: "80px auto", color: "#e23744" }} />
      </Container>
    );
  }

  const menuItems = restaurant?.menu || [];
  const categories = ["All", ...new Set(menuItems.flatMap((item) => item.category || []))];

  const filteredDishes = menuItems.filter((dish) => {
    const matchesCategory = selectedCategory === "All" || dish.category?.includes(selectedCategory);
    const matchesSearch = dish.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container>
      <ZomatoHeader selectedCity={selectedCity} setSelectedCity={setSelectedCity} setOpenAuth={setOpenAuth} />

      <Content>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack style={{ fontSize: "18px" }} />
          Back to Restaurants
        </BackBtn>

        {/* Restaurant Overview */}
        <OverviewCard>
          <ImageGallery>
            <CoverImg
              src={restaurant?.image || restaurant?.img || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000"}
              alt={restaurant?.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000";
              }}
            />
          </ImageGallery>

          <InfoBox>
            <TitleRow>
              <div>
                <RestName>{restaurant?.name}</RestName>
                <CuisinesList>{restaurant?.cuisine?.join(", ")}</CuisinesList>
              </div>
              <RatingBox>
                {restaurant?.rating || 4.5} <Star style={{ fontSize: "18px" }} />
              </RatingBox>
            </TitleRow>

            {restaurant?.discountOffer && (
              <OfferBanner>
                <LocalOffer style={{ fontSize: "18px" }} />
                {restaurant.discountOffer}
              </OfferBanner>
            )}

            <MetaRow>
              <MetaItem>
                <LocationOn style={{ fontSize: "18px", color: "#e23744" }} />
                {restaurant?.address}
              </MetaItem>
              <MetaItem>
                <AccessTime style={{ fontSize: "18px", color: "#696969" }} />
                {restaurant?.openingHours || "10:00 AM - 11:00 PM"}
              </MetaItem>
              <MetaItem>
                <Phone style={{ fontSize: "18px", color: "#696969" }} />
                {restaurant?.contactNumber || "+91 98765 43210"}
              </MetaItem>
              <MetaItem style={{ fontWeight: "700" }}>
                ₹{restaurant?.costForTwo || 300} for two
              </MetaItem>
            </MetaRow>
          </InfoBox>
        </OverviewCard>

        {/* Restaurant Menu */}
        <section>
          <MenuHeader>
            <SectionTitle>Recommended Menu Items ({filteredDishes.length})</SectionTitle>
            <MenuSearch>
              <Search style={{ color: "#9c9c9c", fontSize: "18px" }} />
              <input
                type="text"
                placeholder="Search within menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </MenuSearch>
          </MenuHeader>

          <CategoryTabs style={{ margin: "16px 0 24px 0" }}>
            {categories.map((cat) => (
              <CatTab
                key={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </CatTab>
            ))}
          </CategoryTabs>

          <DishesGrid>
            {filteredDishes.map((dish) => {
              const isVeg = restaurant?.isPureVeg || dish.category?.includes("Pure Veg") || dish.category?.includes("Paneer");
              return (
                <DishCard key={dish._id}>
                  <DishInfo>
                    <VegBadge veg={isVeg}>{isVeg ? "🟢 PURE VEG" : "🔴 NON-VEG"}</VegBadge>
                    <DishName>{dish.name}</DishName>
                    <DishPrice>₹{dish.price?.org || 199}</DishPrice>
                    <DishDesc>{dish.desc}</DishDesc>
                  </DishInfo>

                  <DishImgContainer>
                    <DishImg src={dish.img} alt={dish.name} />
                    <AddBtn onClick={() => handleAddToCart(dish._id)} disabled={cartLoading[dish._id]}>
                      {cartLoading[dish._id] ? <CircularProgress size={16} color="inherit" /> : "ADD +"}
                    </AddBtn>
                  </DishImgContainer>
                </DishCard>
              );
            })}
          </DishesGrid>
        </section>
      </Content>

      <Footer />
    </Container>
  );
};

export default RestaurantDetails;
