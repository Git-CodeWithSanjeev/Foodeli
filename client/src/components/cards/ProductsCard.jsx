import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CircularProgress, Rating } from "@mui/material";
import {
  FavoriteBorder,
  FavoriteRounded,
  ShoppingCartOutlined,
  FlashOn,
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
  width: 290px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #eef0f2;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
    border-color: #e23744;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Top = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const FavoriteBtn = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const RateBadge = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #1c1c1c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Details = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Desc = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const OrgPrice = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #e23744;
`;

const MrpPrice = styled.span`
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #27ae60;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${({ primary }) =>
    primary
      ? `
    background: #e23744;
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 12px rgba(226, 55, 68, 0.25);
    &:hover { background: #d02e3b; }
  `
      : `
    background: #ffffff;
    color: #1c1c1c;
    border: 1.5px solid #dcdfe3;
    &:hover { border-color: #e23744; color: #e23744; }
  `}
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
      dispatch(openSnackbar({ message: "Added to favorites ♥", severity: "success" }));
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
      dispatch(openSnackbar({ message: "Removed from favorites", severity: "info" }));
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
        (fav) => fav._id === product?._id || fav.product?._id === product?._id
      );
      setFavorite(isFavorite);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setCartLoading(true);
      await addToCart({ productId: product?._id, quantity: 1 });
      dispatch(openSnackbar({ message: "Item added to cart 🎉", severity: "success" }));
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to add to cart", severity: "error" }));
    } finally {
      setCartLoading(false);
    }
  };

  const handleOrderNow = async (e) => {
    e.stopPropagation();
    try {
      setCartLoading(true);
      await addToCart({ productId: product?._id, quantity: 1 });
      dispatch(openSnackbar({ message: "Item added to cart 🎉", severity: "success" }));
      navigate("/cart");
    } catch (err) {
      dispatch(openSnackbar({ message: "Failed to add to cart", severity: "error" }));
    } finally {
      setCartLoading(false);
    }
  };

  const handleImageClick = () => {
    navigate(`/dishes/${product._id}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("foodeli-app-token") || localStorage.getItem("krist-app-token");
    if (token && product?._id) {
      checkFavorite();
    }
  }, [product]);

  return (
    <Card onClick={handleImageClick}>
      <Top>
        <Image
          src={product?.img || product?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}
          alt={product?.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
          }}
        />

        <FavoriteBtn onClick={(e) => { e.stopPropagation(); favorite ? removeFavourite() : addFavourite(); }}>
          {favoriteLoading ? (
            <CircularProgress size={18} style={{ color: "#e23744" }} />
          ) : favorite ? (
            <FavoriteRounded style={{ fontSize: "20px", color: "#e23744" }} />
          ) : (
            <FavoriteBorder style={{ fontSize: "20px", color: "#666" }} />
          )}
        </FavoriteBtn>

        <RateBadge>
          <Rating value={product?.rating || 4.2} precision={0.1} size="small" readOnly />
          <span>{product?.rating || 4.2}</span>
        </RateBadge>
      </Top>

      <Details>
        <Title>{product?.name}</Title>
        <Desc>{product?.desc}</Desc>
        <PriceRow>
          <OrgPrice>₹{product?.price?.org || 199}</OrgPrice>
          {product?.price?.mrp && <MrpPrice>₹{product.price.mrp}</MrpPrice>}
          {product?.price?.off && <DiscountBadge>({product.price.off}% OFF)</DiscountBadge>}
        </PriceRow>

        <ButtonRow>
          <ActionBtn onClick={handleAddToCart} disabled={cartLoading}>
            <ShoppingCartOutlined style={{ fontSize: 16 }} /> Add
          </ActionBtn>
          <ActionBtn primary onClick={handleOrderNow} disabled={cartLoading}>
            <FlashOn style={{ fontSize: 16 }} /> Order Now
          </ActionBtn>
        </ButtonRow>
      </Details>
    </Card>
  );
};

export default ProductsCard;
