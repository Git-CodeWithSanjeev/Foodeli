import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress, Rating } from "@mui/material";
import {
  FavoriteBorder,
  FavoriteRounded,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
  addToCart,
} from "../../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/reducers/SnackbarSlice";

const Card = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  @media (max-width: 600px) {
    width: 180px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  border-radius: 6px;
  object-fit: cover;
  transition: all 0.3s ease-out;
  cursor: pointer;
  @media (max-width: 600px) {
    height: 180px;
  }
`;

const Menu = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 14px;
  right: 14px;
  display: none;
  flex-direction: column;
  gap: 12px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;
  &:hover {
    background-color: ${({ theme }) => theme.black};
  }

  &:hover ${Image} {
    opacity: 0.9;
  }
  &:hover ${Menu} {
    display: flex;
  }
`;

const MenuItem = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  cursor: pointer;
`;

const Rate = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;

const Details = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  padding: 4px 10px;
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const RestaurantName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const Cuisine = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary + 80};
  background: ${({ theme }) => theme.bg_secondary + 50};
  padding: 2px 8px;
  border-radius: 12px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  white-space: normal;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const Percent = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: green;
`;

const Span = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;

const ProductsCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const addFavourite = async () => {
    try {
      setFavoriteLoading(true);
      await addToFavourite({ productId: product?._id });
      setFavorite(true);
      dispatch(
        openSnackbar({
          message: "Added to favorites",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("Error adding to favorites:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const removeFavourite = async () => {
    try {
      setFavoriteLoading(true);
      await deleteFromFavourite({ productId: product?._id });
      setFavorite(false);
      dispatch(
        openSnackbar({
          message: "Removed from favorites",
          severity: "success",
        })
      );
    } catch (err) {
      console.error("Error removing from favorites:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      setFavoriteLoading(true);
      const res = await getFavourite();
      const isFavorite = res.data?.some(
        (favorite) => favorite._id === product?._id
      );
      setFavorite(isFavorite);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      await addToCart({ productId: product?._id, quantity: 1 });
      dispatch(
        openSnackbar({
          message: "Added to cart",
          severity: "success",
        })
      );
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const handleImageClick = () => {
    navigate(`/dishes/${product._id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (token) {
      checkFavorite();
    }
  }, [product]);

  return (
    <Card>
      <Top>
        <Image
          src={product?.img || product?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}
          onClick={handleImageClick}
          alt={product?.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
          }}
        />
        <Menu>
          <MenuItem onClick={() => (favorite ? removeFavourite() : addFavourite())}>
            {favoriteLoading ? (
              <CircularProgress size={20} />
            ) : favorite ? (
              <FavoriteRounded sx={{ fontSize: "20px", color: "red" }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: "20px" }} />
            )}
          </MenuItem>
          <MenuItem onClick={handleAddToCart}>
            {cartLoading ? (
              <CircularProgress size={20} />
            ) : (
              <ShoppingBagOutlined sx={{ fontSize: "20px" }} />
            )}
          </MenuItem>
        </Menu>
        <Rate>
          <Rating value={product?.rating || 0} sx={{ fontSize: "14px" }} readOnly />
        </Rate>
      </Top>
      <Details>
        <Title>{product?.name}</Title>
        <Desc>{product?.desc}</Desc>
        <Price>
          ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>
          <Percent>({product?.price?.off}% Off)</Percent>
        </Price>
        <RestaurantInfo>
          <RestaurantName>{product?.restaurant?.name || 'Restaurant'}</RestaurantName>
          {product?.restaurant?.cuisine?.[0] && (
            <Cuisine>{product.restaurant.cuisine[0]}</Cuisine>
          )}
        </RestaurantInfo>
      </Details>
    </Card>
  );
};

export default ProductsCard;
