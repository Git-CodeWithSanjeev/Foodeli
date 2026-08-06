import React from "react";
import styled from "styled-components";
import { Star, AccessTime, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
  width: 360px;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;

  &:hover {
    border-color: #e8e8e8;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 360px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const DiscountOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
  color: #ffffff;
  padding: 24px 14px 10px 14px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TopTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VegTag = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #10b981;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const Name = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RatingBadge = styled.div`
  background: #24963f;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;

const CuisineCostRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #696969;
`;

const CuisineText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 220px;
`;

const CostText = styled.span`
  font-weight: 500;
  color: #363636;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f4f4f4;
  font-size: 12px;
  color: #696969;
  font-weight: 500;
`;

const TimeTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1c1c1c;
  font-weight: 600;
`;

const DistanceTag = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  color: #9c9c9c;
`;

const ZomatoRestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (restaurant?._id) {
      navigate(`/restaurants/${restaurant._id}`);
    } else {
      navigate(`/dishes?search=${encodeURIComponent(restaurant.name)}`);
    }
  };

  return (
    <Card onClick={handleClick}>
      <ImageContainer>
        <Image
          src={restaurant.image || restaurant.img || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"}
          alt={restaurant.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600";
          }}
        />
        {restaurant.isTopBrand && <TopTag>PROMOTED</TopTag>}
        {restaurant.isPureVeg && <VegTag>🟢 PURE VEG</VegTag>}
        {restaurant.discountOffer && (
          <DiscountOverlay>
            🏷️ {restaurant.discountOffer}
          </DiscountOverlay>
        )}
      </ImageContainer>

      <Details>
        <HeaderRow>
          <Name>{restaurant.name}</Name>
          <RatingBadge>
            {restaurant.rating || 4.2}
            <Star style={{ fontSize: "12px" }} />
          </RatingBadge>
        </HeaderRow>

        <CuisineCostRow>
          <CuisineText>{restaurant.cuisine?.join(", ")}</CuisineText>
          <CostText>₹{restaurant.costForTwo || 300} for two</CostText>
        </CuisineCostRow>

        <FooterRow>
          <TimeTag>
            <AccessTime style={{ fontSize: "14px", color: "#e23744" }} />
            {restaurant.deliveryTime || "25 min"}
          </TimeTag>
          <DistanceTag>
            <LocationOn style={{ fontSize: "14px" }} />
            {restaurant.distance ? `${restaurant.distance} km` : "1.2 km"}
          </DistanceTag>
        </FooterRow>
      </Details>
    </Card>
  );
};

export default ZomatoRestaurantCard;
