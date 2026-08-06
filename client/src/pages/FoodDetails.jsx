import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import {
  FavoriteBorderOutlined,
  FavoriteRounded,
  ShoppingCartOutlined,
  FlashOn,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
  getRestaurantDetails,
} from "../api";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { useDispatch } from "react-redux";

const Container = styled.div`
  padding: 40px 30px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  background: ${({ theme }) => theme.bg || "#fafafa"};
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  max-width: 1200px;
  display: flex;
  gap: 48px;
  justify-content: center;
  @media only screen and (max-width: 850px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const ImagesWrapper = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 520px;
  width: 100%;
  max-height: 480px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    max-width: 100%;
    height: 320px;
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
  gap: 10px;
  padding: 18px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef0f2;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
`;

const RestaurantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RestaurantName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1c1c1c;
`;

const RestaurantInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
`;

const CuisineTag = styled.div`
  background: #fff5f5;
  color: #e23744;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1c1c1c;
  margin: 0;
`;

const Desc = styled.p`
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin: 0;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 800;
  color: #e23744;
`;

const Span = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #999;
  text-decoration: line-through;
`;

const Percent = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #27ae60;
`;

const QtySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e23744;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  margin-top: 8px;
`;

const QtyBtn = styled.button`
  width: 36px;
  height: 36px;
  background: #ffffff;
  border: none;
  font-size: 18px;
  font-weight: 700;
  color: #e23744;
  cursor: pointer;

  &:hover {
    background: #fff5f5;
  }
`;

const QtyVal = styled.div`
  width: 44px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #1c1c1c;
  background: #fff8f8;
`;

const Ingridents = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1c;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Item = styled.div`
  background: #f1f3f5;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 14px;
  padding: 20px 0px;
  align-items: center;

  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 12px;
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
  const [quantity, setQuantity] = useState(1);

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
      dispatch(openSnackbar({ message: "Removed from favorites", severity: "info" }));
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
      dispatch(openSnackbar({ message: "Added to favorites ♥", severity: "success" }));
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
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (!token) return;
    setFavoriteLoading(true);
    try {
      const res = await getFavourite();
      const isFav = res.data?.some((fav) => fav._id === id || fav.product?._id === id);
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

  /* ── Add to Cart (stays on page with success toast) ── */
  const handleAddToCart = async () => {
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (!token) {
      dispatch(openSnackbar({ message: "Please sign in to add items to cart", severity: "warning" }));
      return;
    }
    setCartLoading(true);
    try {
      await addToCart({ productId: id, quantity });
      dispatch(
        openSnackbar({
          message: `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart 🎉`,
          severity: "success",
        })
      );
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || "Failed to add to cart",
          severity: "error",
        })
      );
    } finally {
      setCartLoading(false);
    }
  };

  /* ── FULLY FUNCTIONAL ORDER NOW (adds to cart & redirects to checkout) ── */
  const handleOrderNow = async () => {
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (!token) {
      dispatch(openSnackbar({ message: "Please sign in to place an order", severity: "warning" }));
      return;
    }
    setCartLoading(true);
    try {
      await addToCart({ productId: id, quantity });
      dispatch(
        openSnackbar({
          message: "Item added! Redirecting to checkout...",
          severity: "success",
        })
      );
      navigate("/cart");
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.response?.data?.message || "Failed to place order",
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
        <CircularProgress style={{ margin: "80px auto", color: "#e23744" }} />
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

            <Rating value={product?.rating || 4.2} precision={0.1} readOnly />

            <Price>
              ₹{product?.price?.org || 199}{" "}
              {product?.price?.mrp && <Span>₹{product.price.mrp}</Span>}
              {product?.price?.off && <Percent>({product.price.off}% Off)</Percent>}
            </Price>

            <Desc>{product?.desc}</Desc>

            {/* Quantity Selector */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>Quantity</label>
              <QtySelector>
                <QtyBtn onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</QtyBtn>
                <QtyVal>{quantity}</QtyVal>
                <QtyBtn onClick={() => setQuantity((q) => q + 1)}>+</QtyBtn>
              </QtySelector>
            </div>

            {product?.ingredients?.length > 0 && (
              <Ingridents>
                Ingredients
                <Items>
                  {product.ingredients.map((ingredient) => (
                    <Item key={ingredient}>{ingredient}</Item>
                  ))}
                </Items>
              </Ingridents>
            )}

            {restaurant && (
              <RestaurantSection>
                <RestaurantHeader>
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <RestaurantInfo>
                    <InfoItem>
                      <Rating value={restaurant.rating || 4.5} size="small" readOnly />
                      {restaurant.rating || 4.5}
                    </InfoItem>
                    {restaurant.cuisine?.map((cuisine) => (
                      <CuisineTag key={cuisine}>{cuisine}</CuisineTag>
                    ))}
                  </RestaurantInfo>
                </RestaurantHeader>
                <InfoItem>{restaurant.address}</InfoItem>
                <InfoItem>Opening Hours: {restaurant.openingHours || "10:00 AM - 11:00 PM"}</InfoItem>
                <InfoItem>Contact: {restaurant.contactNumber || "+91 98765 43210"}</InfoItem>
              </RestaurantSection>
            )}

            <ButtonWrapper>
              <Button
                text="Add to Cart"
                leftIcon={<ShoppingCartOutlined style={{ fontSize: 18 }} />}
                full
                outlined
                isLoading={cartLoading}
                onClick={handleAddToCart}
              />
              <Button
                text="Order Now"
                leftIcon={<FlashOn style={{ fontSize: 18 }} />}
                full
                isLoading={cartLoading}
                onClick={handleOrderNow}
              />
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "#e23744" }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ fontSize: "22px" }} />
                  )
                }
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
