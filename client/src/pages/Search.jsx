import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllProducts, getNearbyRestaurants } from "../api";
import ProductsCard from "../components/cards/ProductsCard";
import RestaurantCard from "../components/cards/RestaurantCard";
import { CircularProgress } from "@mui/material";
import { Search as SearchIcon, Restaurant, Fastfood } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";

const Container = styled.div`
  padding: 30px;
  max-width: 1300px;
  margin: 0 auto;
  min-height: 100vh;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  margin: 0;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.card || "#ffffff"};
  padding: 14px 20px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  gap: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 16px;
    color: ${({ theme }) => theme.text_primary || "#111827"};
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary || "#111827"};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: flex-start;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.text_secondary || "#6b7280"};
  font-size: 16px;
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setDishes([]);
      setRestaurants([]);
      return;
    }
    setLoading(true);
    try {
      const [dishesRes, restRes] = await Promise.all([
        getAllProducts(`search=${encodeURIComponent(searchTerm)}`),
        getNearbyRestaurants({ search: searchTerm }),
      ]);
      setDishes(dishesRes.data || []);
      setRestaurants(restRes.data?.restaurants || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
    performSearch(val);
  };

  return (
    <Container>
      <Title>Search Food & Restaurants</Title>

      <SearchInputWrapper>
        <SearchIcon style={{ color: "#eb0029", fontSize: "24px" }} />
        <input
          type="text"
          placeholder="Search for dishes, cuisines, or restaurants..."
          value={query}
          onChange={handleInputChange}
        />
      </SearchInputWrapper>

      {loading ? (
        <CircularProgress style={{ margin: "40px auto", color: "#eb0029" }} />
      ) : (
        <>
          {dishes.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionTitle>
                <Fastfood style={{ color: "#eb0029" }} />
                Dishes ({dishes.length})
              </SectionTitle>
              <CardGrid>
                {dishes.map((dish) => (
                  <ProductsCard key={dish._id} product={dish} />
                ))}
              </CardGrid>
            </div>
          )}

          {restaurants.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <SectionTitle>
                <Restaurant style={{ color: "#eb0029" }} />
                Restaurants ({restaurants.length})
              </SectionTitle>
              <CardGrid>
                {restaurants.map((rest) => (
                  <RestaurantCard key={rest._id} restaurant={rest} />
                ))}
              </CardGrid>
            </div>
          )}

          {query && !loading && dishes.length === 0 && restaurants.length === 0 && (
            <NoResults>No matching dishes or restaurants found for "{query}".</NoResults>
          )}
        </>
      )}
    </Container>
  );
};

export default Search;
