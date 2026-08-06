import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import {
  FavoriteBorder,
  FavoriteBorderOutlined,
  FavoriteRounded,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToFavourite,
  deleteFromCart,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
  getRestaurantDetails,
} from "../api";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { useDispatch } from "react-redux";

const Container = styled.div`
  padding: 20px 30px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  max-width: 1400px;
  display: flex;
  gap: 40px;
  justify-content: center;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const ImagesWrapper = styled.div`
  flex: 0.7;
  display: flex;
  justify-content: center;
`;
const Image = styled.img`
  max-width: 500px;
  width: 100%;
  max-height: 500px;
  border-radius: 12px;
  object-fit: cover;
  @media (max-width: 768px) {
    max-width: 400px;
    height: 400px;
  }
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  gap: 18px;
  flex-direction: column;
  padding: 4px 10px;
`;

const RestaurantSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const RestaurantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RestaurantName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const RestaurantInfo = styled.div`
  display: flex;
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const CuisineTag = styled.div`
  background: ${({ theme }) => theme.primary + 15};
  color: ${({ theme }) => theme.primary};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;

const Percent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: green;
`;

const Ingridents = styled.div`
  font-size: 16px;
  font-weight: 500;
  diaplay: flex;
  flex-direction: column;
  gap: 24px;
`;
const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Item = styled.div`
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  padding: 4px 12px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 32px 0px;
  @media only screen and (max-width: 700px) {
    gap: 12px;
    padding: 12px 0px;
  }
`;

const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [restaurant, setRestaurant] = useState(null);

  const getProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductDetails(id);
      setProduct(res.data);
      if (res.data?.restaurant) {
        if (typeof res.data.restaurant === "object" && res.data.restaurant.name) {
          setRestaurant(res.data.restaurant);
        } else {
          const restId = typeof res.data.restaurant === "object" ? res.data.restaurant._id : res.data.restaurant;
          if (restId) {
            const restaurantRes = await getRestaurantDetails(restId);
            setRestaurant(restaurantRes.data);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async () => {
    setFavoriteLoading(true);
    try {
      await deleteFromFavourite({ productId: id });
      setFavorite(false);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || err.message,
          severity: "error",
        })
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const addFavourite = async () => {
    setFavoriteLoading(true);
    try {
      await addToFavourite({ productId: id });
      setFavorite(true);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || err.message,
          severity: "error",
        })
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const checkFavorite = async () => {
    const token = localStorage.getItem("foodeli-app-token");
    if (!token) return;
    setFavoriteLoading(true);
    try {
      const res = await getFavourite();
      const isFav = res.data?.some((fav) => fav._id === id);
      setFavorite(isFav);
    } catch (err) {
      console.error("Favorite status check error:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getProduct();
    checkFavorite();
  }, [id]);

  const addCart = async () => {
    setCartLoading(true);
    try {
      await addToCart({ productId: id, quantity: 1 });
      dispatch(
        openSnackbar({
          message: "Added to cart successfully",
          severity: "success",
        })
      );
      navigate("/cart");
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || err.message,
          severity: "error",
        })
      );
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Wrapper>
          <ImagesWrapper>
            <Image
              src={product?.img || product?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"}
              alt={product?.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";
              }}
            />
          </ImagesWrapper>
          <Details>
            <div>
              <Title>{product?.name}</Title>
            </div>
            <Rating value={3.5} />
            <Price>
              ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>{" "}
              <Percent> (₹{product?.price?.off}% Off) </Percent>
            </Price>

            <Desc>{product?.desc}</Desc>

            <Ingridents>
              Ingridents
              <Items>
                {product?.ingredients.map((ingredient) => (
                  <Item key={ingredient}>{ingredient}</Item>
                ))}
              </Items>
            </Ingridents>

            {restaurant && (
              <RestaurantSection>
                <RestaurantHeader>
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <RestaurantInfo>
                    <InfoItem>
                      <Rating value={restaurant.rating || 0} size="small" readOnly />
                      {restaurant.rating}
                    </InfoItem>
                    {restaurant.cuisine?.map((cuisine) => (
                      <CuisineTag key={cuisine}>{cuisine}</CuisineTag>
                    ))}
                  </RestaurantInfo>
                </RestaurantHeader>
                <InfoItem>{restaurant.address}</InfoItem>
                <InfoItem>Opening Hours: {restaurant.openingHours}</InfoItem>
                <InfoItem>Contact: {restaurant.contactNumber}</InfoItem>
              </RestaurantSection>
            )}

            <ButtonWrapper>
              <Button
                text="Add to Cart"
                full
                outlined
                isLoading={cartLoading}
                onClick={() => addCart()}
              />
              <Button text="Order Now" full />
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "red" }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ fontSize: "22px" }} />
                  )
                }
                full
                outlined
                isLoading={favoriteLoading}
                onClick={() => (favorite ? removeFavourite() : addFavourite())}
              />
            </ButtonWrapper>
          </Details>
        </Wrapper>
      )}
    </Container>
  );
};

export default FoodDetails;
