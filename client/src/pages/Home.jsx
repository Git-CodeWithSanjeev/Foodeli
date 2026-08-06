import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { category } from "../utils/data";
import HeaderImage from "../utils/Images/Header.png";
import ProductCategoryCard from "../components/cards/ProductCategoryCard";
import ProductsCard from "../components/cards/ProductsCard";
import RestaurantCard from "../components/cards/RestaurantCard";
import { getPopularProducts, getNearbyRestaurants } from "../api";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { Restaurant, ArrowForward } from "@mui/icons-material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Img = styled.img`
  width: 100%;
  max-width: 1200px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text_primary || "#111827"};
`;

const ViewAllLink = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary || "#eb0029"};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    text-decoration: underline;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;

const Home = () => {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);

  const fetchPopularProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await getPopularProducts();
      setPopularProducts(response.data);
    } catch (error) {
      console.error("Error fetching popular products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchRestaurants = async () => {
    setLoadingRestaurants(true);
    try {
      const response = await getNearbyRestaurants();
      if (response.data?.restaurants) {
        setNearbyRestaurants(response.data.restaurants.slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    fetchPopularProducts();
    fetchRestaurants();
  }, []);

  return (
    <Container>
      <Section>
        <Img src={HeaderImage} alt="Header" />
      </Section>

      <Section>
        <Title>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Restaurant style={{ color: "#eb0029" }} />
            Nearby Restaurants
          </span>
          <ViewAllLink to="/restaurants">
            View All <ArrowForward style={{ fontSize: "18px" }} />
          </ViewAllLink>
        </Title>
        {loadingRestaurants ? (
          <CircularProgress style={{ color: "#eb0029", margin: "20px auto" }} />
        ) : (
          <CardWrapper>
            {nearbyRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </CardWrapper>
        )}
      </Section>

      <Section>
        <Title>Food Categories</Title>
        <CardWrapper>
          {category.map((item) => (
            <ProductCategoryCard key={item.id || item.name} category={item} />
          ))}
        </CardWrapper>
      </Section>

      <Section>
        <Title>Most Popular Dishes</Title>
        {loadingProducts ? (
          <CircularProgress style={{ color: "#eb0029", margin: "20px auto" }} />
        ) : (
          <CardWrapper>
            {popularProducts.map((product) => (
              <ProductsCard key={product._id} product={product} />
            ))}
          </CardWrapper>
        )}
      </Section>
    </Container>
  );
};

export default Home;
