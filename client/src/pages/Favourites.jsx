import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductsCard from "../components/cards/ProductsCard";
import { getFavourite } from "../api";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

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

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ $center }) => ($center ? "center" : "space-between")};
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
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

const EmptyMessage = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  padding: 40px 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const SignInMessage = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  padding: 40px 0;
`;

const Favourites = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await getFavourite();
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      dispatch(
        openSnackbar({
          message: error.response?.data?.message || "Failed to fetch favorites",
          severity: "error",
        })
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (token) {
      getProducts();
    }
  }, []);

  const renderContent = () => {
    const isUserTokenPresent = Boolean(
      localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token")
    );
    if (!isUserTokenPresent) {
      return <SignInMessage>Please sign in to view your favorites</SignInMessage>;
    }

    if (loading) {
      return (
        <LoadingWrapper>
          <CircularProgress />
        </LoadingWrapper>
      );
    }

    return (
      <CardWrapper>
        {products.length === 0 ? (
          <EmptyMessage>No favourites added yet</EmptyMessage>
        ) : (
          products.map((product) => (
            <ProductsCard 
              key={product._id} 
              product={product} 
              onFavoriteChange={() => getProducts()}
            />
          ))
        )}
      </CardWrapper>
    );
  };

  return (
    <Container>
      <Section>
        <Title>Your Favourites</Title>
        {renderContent()}
      </Section>
    </Container>
  );
};

export default Favourites;
